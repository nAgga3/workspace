function imaadpcm_cretor(){

  var _ref = this;
  const INDEX_TABLE = [
      -1, -1, -1, -1, 2, 4, 6, 8,
      -1, -1, -1, -1, 2, 4, 6, 8];
  const STEP_TABLE = [
      7, 8, 9, 10, 11, 12, 13, 14,
      16, 17, 19, 21, 23, 25, 28, 31,
      34, 37, 41, 45, 50, 55, 60, 66,
      73, 80, 88, 97, 107, 118, 130, 143,
      157, 173, 190, 209, 230, 253, 279, 307,
      337, 371, 408, 449, 494, 544, 598, 658,
      724, 796, 876, 963, 1060, 1166, 1282, 1411,
      1552, 1707, 1878, 2066, 2272, 2499, 2749, 3024,
      3327, 3660, 4026, 4428, 4871, 5358, 5894, 6484,
      7132, 7845, 8630, 9493, 10442, 11487, 12635, 13899,
      15289, 16818, 18500, 20350, 22385, 24623, 27086, 29794,
      32767];
  let encoderPredicted_ = 0;
  let encoderIndex_ = 0;
  let encoderStep_ = 7;
  let decoderPredicted_ = 0;
  let decoderIndex_ = 0;
  let decoderStep_ = 7;

  function encode(samples) {
    /** @type {!Uint8Array} */
    let adpcmSamples = new Uint8Array((samples.length));
    /** @type {!Array<number>} */
    let block = [];
    /** @type {number} */
    let fileIndex = 0;
    /** @type {number} */
    let blockCount = 0;
    for (let i=0; i<samples.length; i++) {
      if ((i % 505 == 0 && i != 0)) {
        adpcmSamples.set(encodeBlock(block), fileIndex);
        fileIndex += 256;
        block = [];
        blockCount++;
      }
      block.push(samples[i]);
    }
    let samplesLength = samples.length / 2;
    if (samplesLength % 2) {
      samplesLength++;
    }
    return adpcmSamples.slice(0, samplesLength + 512 + blockCount * 4);
  }

  function decode(adpcmSamples, blockAlign=256) {
    /** @type {!Int16Array} */
    let samples = new Int16Array(adpcmSamples.length * 2);
    /** @type {!Array<number>} */
    let block = [];
    /** @type {number} */
    let fileIndex = 0;
    for (let i=0; i<adpcmSamples.length; i++) {
      if (i % blockAlign == 0 && i != 0) {            
        let decoded = decodeBlock(block);
        samples.set(decoded, fileIndex);
        fileIndex += decoded.length;
        block = [];
      }
      block.push(adpcmSamples[i]);
    }
    return samples;
  }

  function encodeBlock(block) {
    /** @type {!Array<number>} */
    let adpcmSamples = blockHead_(block[0]);
    for (let i=3; i<block.length; i+=2) {
      /** @type {number} */
      let sample2 = encodeSample_(block[i]);
      /** @type {number} */
      let sample = encodeSample_(block[i + 1]);
      adpcmSamples.push((sample << 4) | sample2);
    }
    return adpcmSamples;
  }

  function encodeBlockDataView(block) {
    /** @type {!Array<number>} */
    let adpcmSamples = blockHead_(block.getInt16(1));
    for (let i=3; i<block.byteLength-4; i+=4) {
      /** @type {number} */
      let sample2 = encodeSample_(block.getInt16(i));
      /** @type {number} */
      let sample = encodeSample_(block.getInt16(i + 2));
      adpcmSamples.push((sample << 4) | sample2);
    }
    return adpcmSamples;
  }

  function decodeBlock(block) {
    decoderPredicted_ = sign_((block[1] << 8) | block[0]);
    decoderIndex_ = block[2];
    decoderStep_ = STEP_TABLE[decoderIndex_];
    /** @type {!Array<number>} */
    let result = [
        decoderPredicted_,
        decoderPredicted_
      ];
    for (let i=4; i<block.length; i++) {
      /** @type {number} */
      let original_sample = block[i];
      /** @type {number} */
      let second_sample = original_sample >> 4;
      /** @type {number} */
      let first_sample = (second_sample << 4) ^ original_sample;
      result.push(decodeSample_(first_sample));
      result.push(decodeSample_(second_sample));
    }
    return result;
  }

  function sign_(num) {
    return num > 32768 ? num - 65536 : num;
  }

  function encodeSample_(sample) {
    /** @type {number} */
    let delta = sample - encoderPredicted_;
    /** @type {number} */
    let value = 0;
    if (delta >= 0) {
      value = 0;
    } else {
      value = 8;
      delta = -delta;
    }
    /** @type {number} */
    let step = STEP_TABLE[encoderIndex_];
    /** @type {number} */
    let diff = step >> 3;
    if (delta > step) {
      value |= 4;
      delta -= step;
      diff += step;
    }
    step >>= 1;
    if (delta > step) {
      value |= 2;
      delta -= step;
      diff += step;
    }
    step >>= 1;
    if (delta > step) {
      value |= 1;
      diff += step;
    }
    updateEncoder_(value, diff);
    return value;
  }

  function updateEncoder_(value, diff) {
    if (value & 8) {
      encoderPredicted_ -= diff;
    } else {
      encoderPredicted_ += diff;
    }
    if (encoderPredicted_ < -0x8000) {
      encoderPredicted_ = -0x8000;
    } else if (encoderPredicted_ > 0x7fff) {
      encoderPredicted_ = 0x7fff;
    }
    encoderIndex_ += INDEX_TABLE[value & 7];
    if (encoderIndex_ < 0) {
      encoderIndex_ = 0;
    } else if (encoderIndex_ > 88) {
      encoderIndex_ = 88;
    }
  }

  function decodeSample_(nibble) {
    /** @type {number} */
    let difference = 0;
    if (nibble & 4) {
      difference += decoderStep_;
    }
    if (nibble & 2) {
      difference += decoderStep_ >> 1;
    }
    if (nibble & 1) {
      difference += decoderStep_ >> 2;
    }
    difference += decoderStep_ >> 3;
    if (nibble & 8) {
      difference = -difference;
    }
    decoderPredicted_ += difference;
    if (decoderPredicted_ > 32767) {
      decoderPredicted_ = 32767;
    } else if (decoderPredicted_ < -32767) {
      decoderPredicted_ = -32767;
    }
    updateDecoder_(nibble);
    return decoderPredicted_;
  }

  function updateDecoder_(nibble) {
    decoderIndex_ += INDEX_TABLE[nibble];
    if (decoderIndex_ < 0) {
      decoderIndex_ = 0;
    } else if (decoderIndex_ > 88) {
      decoderIndex_ = 88;
    }
    decoderStep_ = STEP_TABLE[decoderIndex_];
  }

  function blockHead_(sample) {
    encodeSample_(sample);
    /** @type {!Array<number>} */
    let adpcmSamples = [];
    adpcmSamples.push(sample & 0xFF);
    adpcmSamples.push((sample >> 8) & 0xFF);
    adpcmSamples.push(encoderIndex_);
    adpcmSamples.push(0);
    return adpcmSamples;
  }

  // -- PUBLIC METHODS ***************************************************************************************************
  Object.defineProperty(_ref, 'encode', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': encode });
  Object.defineProperty(_ref, 'decode', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': decode });
  Object.defineProperty(_ref, 'encodeBlock', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': encodeBlock });
  Object.defineProperty(_ref, 'decodeBlock', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': decodeBlock });
  Object.defineProperty(_ref, 'encodeBlockDataView', { 'enumerable': true, 'configurable': false, 'writable': false, 'value': encodeBlockDataView });
  // -- END PUBLIC METHODS ***********************************************************************************************

  return _ref;
}


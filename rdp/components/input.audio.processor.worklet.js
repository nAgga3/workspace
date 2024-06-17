class RecorderWorkletProcessor extends AudioWorkletProcessor {
    constructor() {
		super();
        this.imaadpcm = null;
        this.recordSampleRate = 44100;
        this.outSampleRate = 44100;
        this.numChannels = 2;
        this.minNoiseThreshold = 0.0025;
        this.recBuffer = [];
        this.recFormatPCM = true;
        this.port.onmessage = (event) => {
	        // Handling data from the node.
            var objConfig = event.data;
            if (objConfig.outputSampleRate) this.outSampleRate = objConfig.outputSampleRate;
            if (objConfig.channels) this.numChannels = objConfig.channels;
            if (objConfig.noiseThreshold) this.minNoiseThreshold = objConfig.noiseThreshold;
            if (objConfig.PCMFormat) this.recFormatPCM = objConfig.PCMFormat;
            if (objConfig.sampleRate) this.recordSampleRate = objConfig.sampleRate;
            //recordSampleRate = objConfig.sampleRate;
            for (let channel = 0; channel < this.numChannels; channel++)  this.recBuffer[channel] = [];
		};
    }
    static get parameterDescriptors() {
        return [{
            name: 'phase',
            defaultValue: 0,
            minValue: 0,
            maxValue: 180
        },
        {
            name: 'amplitude',
            defaultValue: 100,
            minValue: 0,
            maxValue: 100
        }];
    }

    noiseFilter(input) {
        let lf = this.minNoiseThreshold * -1;
        let hf = this.minNoiseThreshold;
        let c = true;
        let ichannel = 0;
        let channels = input.length;
        while (c && ichannel < channels) {
            let idx = 0;
            let buffLen = input[ichannel].length;
            while (c && idx < buffLen) {
                let value = input[ichannel][idx];
                if (value < lf || value > hf) c = false;
                idx++;
            }
            ichannel++;
        }
        return !c ? input : null;
    }
    downsampleBuffer(buffer, exportSampleRate) {
        if (exportSampleRate === this.recordSampleRate) {
            return buffer;
        }
        var sampleRateRatio = this.recordSampleRate / exportSampleRate;
        var newLength = Math.round(buffer.length / sampleRateRatio);
        var result = new Float32Array(newLength);
        var offsetResult = 0;
        var offsetBuffer = 0;
        while (offsetResult < result.length) {
            var nextOffsetBuffer = Math.round((offsetResult + 1) * sampleRateRatio);
            var accum = 0,
                count = 0;
            for (var i = offsetBuffer; i < nextOffsetBuffer && i < buffer.length; i++) {
                accum += buffer[i];
                count++;
            }
            result[offsetResult] = accum / count;
            offsetResult++;
            offsetBuffer = nextOffsetBuffer;
        }
        return result;
    }
    newFloatTo16BitPCM(output, offset, input) {
        for (var i = 0; i < input.length; i++ , offset += 2) {
            var s = Math.max(-1, Math.min(1, input[i]));
            output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
        }
    }
    mergeBuffers(bufferArray, _recLength) {
        var result = new Float32Array(_recLength);
        var offset = 0;
        for (var i = 0; i < bufferArray.length; i++) {
            result.set(bufferArray[i], offset);
            offset += bufferArray[i].length;
        }
        return result;
    }
    process(inputs, outputs, parameters) {
		//if (inputs.length && inputs[0].length)
		//{
		//	this.port.postMessage(inputs[0]); //this.downsampleBuffer(inputChannel, 44100));
		//}
		//return true;
        // y(t) = A\sin(2 pi f t + phi) = A\sin(omega t + phi) --> Sine Wave or sinusoid
        const input = inputs[0];
        var output = outputs[0];
        const amplitude = parameters['amplitude'][0];
        const phase = parameters['phase'][0];
        //console.log('phase in process', phase)
        var _recLength = 0;
        if (input.length > 0) {
            for (let channel = 0; channel < output.length; ++channel) {
                //const map1 = input[channel].map(x => -1.0 * x);
                //output[channel].set(map1);
                // TODO: fit phase.
                const _amplitude = amplitude / 100.0;
                const size = input[channel].length;
                for (let i = 0; i < size; ++i)
                    output[channel][(i + phase) % size] = -1.0 * input[channel][i] * _amplitude;
            }

            var chann = null;
            var channCount = null;
            var stereoBuffer = null;
            var buffer = null;
            var view = null;

            output = this.noiseFilter(output);
            if (output) {
                if (this.recFormatPCM) {
                    //procBuff = event.data;
                    channCount = this.recBuffer.length;
                    stereoBuffer = new Float32Array(output[0].length * channCount);
                    if (channCount > 1) {
                        for (var i = 0; i < output[0].length; i++)
                            for (chann = 0; chann < channCount; chann++)
                                stereoBuffer[i * channCount + chann] = output[chann][i];
                    } else {
                        stereoBuffer = output[0];
                    }
                    stereoBuffer = this.downsampleBuffer(stereoBuffer, this.outSampleRate);
                    buffer = new ArrayBuffer(stereoBuffer.length * 2);
                    view = new DataView(buffer);
                    this.newFloatTo16BitPCM(view, 0, stereoBuffer);
                } else {
                    while (_recLength > buffSliceCount) {
                        // strip 505 samples from recorded buffer
                        output = [];
                        channCount = this.recBuffer.length;
                        var newBuffers = [];
                        var newBufferFinal = [];
                        for (var channel = 0; channel < channCount; channel++) {
                            newBuffers.push(this.mergeBuffers(this.recBuffer[channel], _recLength));
                        }

                        for (var channIdx = 0; channIdx < channCount; channIdx++) {
                            output.push(newBuffers[channIdx].slice(0, buffSliceCount));
                            newBufferFinal.push([newBuffers[channIdx].slice(buffSliceCount, _recLength)]);
                        }
                        _recLength -= buffSliceCount;
                        this.recBuffer = newBufferFinal;

                        channCount = output.length;
                        stereoBuffer = new Float32Array(output[0].length * channCount);
                        if (channCount > 1) {
                            for (var i = 0; i < output[0].length; i++)
                                for (chann = 0; chann < channCount; chann++)
                                    stereoBuffer[i * channCount + chann] = output[chann][i];
                        } else stereoBuffer = output[0];
                        stereoBuffer = this.downsampleBuffer(stereoBuffer, this.outSampleRate);
                        buffer = new ArrayBuffer(stereoBuffer.length * 2);
                        view = new DataView(buffer);
                        this.newFloatTo16BitPCM(view, 0, stereoBuffer);
                        buffer = view;
                    }
                }
                this.port.postMessage(buffer);
            }
        }
        return true;
	}
}
registerProcessor('recorder-worklet', RecorderWorkletProcessor);
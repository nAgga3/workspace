var filemanConsts = {
	// File browser phrases.
	AjaxFileBrowser: {
        Commands: {
            UndoCommand: 'Undo {0}',
            CancelCommand: 'Cancel {0}',
            Names: {
                Load: 'Load',
                Copy: 'Copy',
                CreateFolder: 'Create Folder',
                Delete: 'Delete',
                LoadFolder: 'Load Folder',
                LoadItem: 'Load Item',
                LoadTree: 'Load Tree',
                Move: 'Move',
                Rename: 'Rename',
                Search: 'Search'
            },
            Process: {
                Load: 'Loading...',
                Copy: 'Copying "{0}"...',
                CreateFolder: 'Creating Folder "{0}"...',
                Delete: 'Deleting "{0}"...',
                LoadFolder: 'Loading Folder "{0}"...',
                LoadItem: 'Loading Item "{0}"...',
                LoadTree: 'Loading Tree "{0}"...',
                Move: 'Moving "{0}"...',
                Rename: 'Renaming "{0}"...',
                Search: 'Searching "{0}"...'
            }
        },
		Interface: {
			Buttons: {
				Copy:                'Copy',
				CustomProp:          'Custom Properties',
				Cut:                 'Cut',
                Close:               'Close',
				Delete:              'Delete',
				Details:             'Details',
				Download:            'Download',
				Edit:                'Edit',
				ExtraLargeIcons:     'Extra Large Icons',
			    FileManager:         'Open OS\'s File Manager.',
				Folders:             'Folders',
				Info:                'Properties',
				LargeIcons:          'Large Icons',
				Lock:                'Lock',
				Log:                 'Log',
				MediumIcons:         'Medium Icons',
				NewFolder:           'New Folder',
				Paste:               'Paste',
				Redo:                'Redo',
			    Refresh:             'Refresh',
				VersionUpdateToThis: 'Update',
				VersionRemove:       'Remove',
				VersionDownload:     'Download',
                Versions:            'Versions',
				Views:               'Views',
				Undo:                'Undo',
				Unlock:              'Unlock',
				Up:                  'Up',
				Upload:              'Upload',
				UploadFolder:        'Upload Folder'
			},
			Add:                                       'Add',
			AddProperty:                               'Add Property',
			Address:                                   'Address:',
			BrowseFiles:                               'Browse...',
			BuyNow:                                    'Buy Now',
			Cancel:                                    'Cancel',
			CannotCreateDocument:                      'Selected document is not created.',
			CannotEditFile:                            'Current file cannot be opened for editing.',
			Close:                                     'Close',
			CopyPattern:                               'Copy',
			Create:                                    'Create',
			Created:                                   'Created:',
			CrossDomainRequestsIssue:                  'Your server may not be configured to allow cross-domain requests.<br/>Please see how to enable cross-domain requests <a target="_blank" href="http://www.webdavsystem.com/ajaxfilebrowser/programming/cross_domain">here</a>.<br/>',
			CrossDomainRequestsIssueIE:                'Your Internet Explorer may not be configured to allow cross-domain requests.<br/>Please see how to enable cross-domain requests in Interner Explorer 9 and earlier <a target="_blank" href="http://www.webdavsystem.com/ajaxfilebrowser/programming/cross_domain">here</a>.<br/>',
			CrossDomainRequestsIssueTitle:             'Failed to connect to server',
			DateModified:                              'Date Modified',
			Delete:                                    'Delete',
			DeleteItemsConfirmQuestion:                'Are you sure you want to delete selected item(s)?',
			DeletePropertiesConfirmQuestion:           'Are you sure want to delete selected property(s)?',
			DeleteVersionConfirmQuestion:              'Are you sure want to delete selected version?',
			Details:                                   'Details',
			DropFilesIEUnsupported:                    'Files drag and drop from file system is supported only in Internet Explorer 10, Chrome 4, FireFox 3.6, Safari 4 and later versions.',
			Edit:                                      'Edit',
			EditProperty:                              'Edit Рroperty',
			Error:                                     'Error:',
			ErrorDetails:                              'Error Details',
			FailedToOpenWinExplorer:                   'Failed to open WebDAV folder in Windows Explorer.',
			File:                                      'File',
			FileExistsOverwriteConfirmQuestion:        'File "{0}" already exists. Do you want to overwrite it?',
			FileFolderType:                            'Folder',
			FileNameSpecialCharactersRestriction:      'The name cannot contain any of the following characters:\n\t\t{0}',
			FilePrecentInUploadList:                   'Selected file is already present in upload list.',
			FilesPresentInUploadList:                  'The following file(s) is present in the upload list:\n\n{0}',
			FilesResumeNotInListOrChanged:             'The following file(s) was modified:\n{0}\n\n'+
                'The following file(s) was not among your selection for resume in the upload list:\n{1}\n\nThe upload will start from the begging of each file.',
			FileUploadFailed:                          'Failed to upload the file.',
			FillOutFileName:                           'Specify the file name.',
			FillOutFolderName:                         'Specify the folder name.',
			FirefoxLargeFilesToUpload:                 'In Firefox files over 100 Mb cannot be uploaded together with other files or via drag and drop. The following files are too large:\n\n<b>{0}</b>\n\n'+
			                                               'To upload this file(s) you must select them one by one using "Browse..." button or use other browser.',
			FirefoxFolderDropNotSupported:             'Folders drag and drop is available only in Google Chrome 21 and later versions.',
			ItemAlreadyExists:                         'Item already exists.',
            FolderAlreadyExists:                       'Folder already exists.',
			FolderName:                                'Folder name',
			FolderUploadNotAvailedInYourBrowser:       'Folders upload is available only in Google Chrome 21 and later versions.',
			FollowingErrorsOccurred:                   'The Following Errors Has Occurred',
            FreeSpace:                                 'Free space:',
			GetPropertiesError:                        'Properties are not selected.',
			GetVersionsError:                          'Versions are not selected.',
			HttpNotAvailableError:                     'Server is not available.',
			Item:                                      'Item',
			ItemType:                                  'Item type:',
			LocalResource:                             'Local Resource',
			Location:                                  'Location:', // Item URI.
			Log:                                       'Log',
			ManageProperties:                          'Manage Properties',
			Message:                                   'Message',
			Modified:                                  'Modified:',
			MoveFolderToSubfolderRestriction:          'The destination folder is a subfolder of the source folder.',
			MoveFileToSameDirectoryRestriction:        'The source and destination file names are the same.',
			Name:                                      'Name',
			Namespace:                                 'Namespace',
			NewFolder:                                 'New Folder',
			NewFolderPattern:                          'New Folder',
			NewName:                                   'New name',
			No:                                        'No',
			NonExistentLocation:                       'Location does not exist.',
			NotFoundLocation:                          'Location "{0}" not found.',
			NoToAll:                                   'No to All',
			OK:                                        'OK',
			OperationCannotBePerformed:                'Operation Cannot Be Performed:',
			OverwriteConfirm:                          'Overwrite Confirm',
			Properties:                                'Properties',
			ProtectedForRunningFileExtension:          'File with extension "{0}" protected for running.',
			PropertyNameRestriction:                   'Property name and namespace can not be empty and must begin with a letter, may be followed by letters, digits, hyphens, underscores and periods.',
			Rename:                                    'Rename',
			RequestError:                              'Error',
			Safari51WindowsMultiUploadNotSupported:    'Safari 5.1.x does not support multiselection via \'Browse\' button. Please use drag and drop or select a single file only or use other web browser.',
			Search:                                    'Search:',
			Size:                                      'Size:',
			Source:                                    'Source',
			SpecifyItemName:                           'Specify the item name',
			TargetFolder:                              'Target Folder',
            TotalSpace:                                'Total space:',
			Type:                                      'Type',
			TrialPeriodExpired:                        'The trial period has expired.',
			UpdateFile:                                'Update File',
			Upload:                                    'Upload',
			UploadCaption:                             'Upload',
			UploadCaptionForDnDFilesSupportedBrowsers: 'To upload drag and drop files here or into folder structure.',
			UploadFile:                                'Upload Files',
			UploadInProgressWarning:                   'One or more files are being uploaded. If you close this page upload will be paused.',
			UsedPercent:                               'Used: {0}%',
            UsedSpace:                                 'Used space:',
			Value:                                     'Value',
			Versions:                                  'Versions',
			VersionUpdateToThisTooltip:                'Update to this version',
			Yes:                                       'Yes',
			YesToAll:                                  'Yes to All',
			WarningOldVersion:                         'Ajax File Browser has detected that your IT Hit WebDAV server version is {0}. For correct versions support it is recommended to upgrade to v3.5.x or later version. To avoid this message set SuppressServerWarning=true when creating Ajax File Browser.',
			WebFoldersUpdate:                          'Please install <a target="_blank" href="{0}">Software Update for Web Folders</a>.'
		},
		FileSizes: {
			Bytes: 'Bytes',
			B:     'B',
			GB:    'GB',
			KB:    'KB',
			MB:    'MB'
		},
		Menu: {
			ArrangeIconsBy:           'Arrange Icons By',
			CancelUpload:             'Cancel',
			Copy:                     'Copy',
			CustomProperties:         'Custom Properties...',
			Cut:                      'Cut',
			Delete:                   'Delete',
			Details:                  'Details',
			EditDocument:             'Edit Document',
			ExtraLargeIcons:          'Extra Large Icons',
			LargeIcons:               'Large Icons',
			Lock:                     'Lock...',
			Name:                     'Name',
			NewDocument:              'New Document',
			NewFolder:                'New Folder...',
			NewWord:                  'Microsoft Office Word Document',
			NewExcel:                 'Microsoft Office Excel Worksheet',
			NewPowerPoint:            'Microsoft Office PowerPoint Presentation',
			MediumIcons:              'Medium Icons',
			Modified:                 'Modified',
			OpenContainingFolderInFM: 'Open Containing Folder',
			OpenDownload:             'Download',
			OpenFolderInFM:           'Open Folder in File Manager',
			OpenLocation:             'Open Item Location',
			Paste:                    'Paste',
			PauseUpload:              'Pause',
			Properties:               'Properties...',
			Refresh:                  'Refresh',
			Rename:                   'Rename...',
			RestartUpload:            'Restart Upload',
			ResumeUpload:             'Resume',
			Size:                     'Size',
			Type:                     'Type',
			Unlock:                   'Unlock...',
			UpdateFile:               'Update File...',
			UploadFile:               'Upload Files...',
			UploadFolder:             'Upload Folder...',
            Versions:                 'Versions...',
			View:                     'View',
			ViewError:                'View Error...'
		},
		Grid: {
			DateModified:   'Date Modified',
			FileTypePrefix: 'File ',
			Name:           'Name',
			Size:           'Size',
			Type:           'Type',
			Folder:         'Folder'
		},
        Property: {
            Name:      'Name',
            Namespace: 'Namespace',
            Value:     'Value'
        },
        Version: {
            Name:         'Version Name',
            CreationDate: 'Creation Date',
            Size:         'Size',
            Comments:     'Comments',
            SavedBy:      'Saved By'
        },
		Upload: {
			Destination:     'Destination',
			Elapsed:         'Elapsed',
			Error:           'Error',
			FileSize:        'File Size',
			Left:            'Left',
			Paused:          'Paused',
			Progress:        'Progress',
			ProgressPercent: 'Status',
			Queued:          'Queued',
            RetryIn:         'Retry in {0}s',
			Source:          'File',
			Speed:           'Speed',
			Uploaded:        'Uploaded'
		},
		StatusDescriptions: {},
		Exceptions: {
			TrySearchByResource:                           'You try to search by resource. Only folders support search.',
			BytesUploadedIsMoreThanTotalFileContentLength: 'Bytes uploaded cannot be more than total file content length.',
			DestinationLocationNotPassed:                  'Destination URL is not passed.',
			EmptyElementParameter:                         'Element parameter is empty.',
			EmptyUrlProvided: 		                       'Please specify WebDAV server url.',
			FolderInstanceExpected:                        'ITHit.WebDAV.Client.AjaxFileBrowser.Folder instance object expected as input parameter.',
			FunctionalityNotSupported:                     'Functionality {0} is not supported by your browser.',
			HierarchyItemInstanceExpected:                 'ITHit.WebDAV.Client.AjaxFileBrowser.HierarchyItem instance object expected as input parameter.',
			InterfaceLabelIsNotPassed:                     'Interface label is not passed.',
			KeyCodeNotSpecified:                           'Key code not specified. Passed: {0}',
			NonExistentLocation:                           'Location "{0}" does not exist.',
			ResourceInstanceExpected:                      'ITHit.WebDAV.Client.AjaxFileBrowser.Resource instance object expected as input parameter.',
			SessionNotStarted:                             'Session is not started. Possible reason: ITHit WebDAV AJAX Library is not loaded.',
			UnexpectedUploadItemState:                     'Unexpected upload item state: {0}',
			UploadProgressInfoInstanceExpected:            'ITHit.WebDAV.Client.AjaxFileBrowser.InternalUploadProgressInfo instance expected.',
			WrongBaseUrl:                                  'Incorrect URL provided or URl is empty.',
			WrongContentLengthType:                        'File content length is expected to be an integer.',
			WrongCountAsMaximumUploadTasks:                'Expected integer value above zero as count of maximum upload tasks at the same time. Passed: {0}',
			WrongCountInputParameters:                     'Wrong count of imput parameters passed.',
			WrongElementIdOrObject:                        'Expected element as string id or object.',
			WrongInterfaceHandler:                         'Wrong interface handler indentifier. Passed: {0}',
			WrongMenuItemType:                             'Passed wrong menu item type. Passed: {0}',
			WrongParametrType:                             'Wrong parameter type.',
			WrongTemplateIndex:                            'Passed wrong template index.',
			WrongUploadedBytesType:                        'Count of uploaded bytes expected to be a integer.',
			WrongUrl:                                      'Passed wrong URL: "{0}".',
			WrongViewModeIndex:                            'Passed wrong view mode index: "{0}".'
		},
		ContextHelp: {
			Commands: {
			    CancelUpload:       'Cancel upload of the selected file.',
			    Copy:               'Copy the selected items to the clipboard. To put them in the new location, use the Paste command.',
			    CustomProp:         'Manage custom properties associated with the selected item.',
			    Cut:                'Cut the selected items to buffer.',
			    Delete:             'Deletes the selected items.',
				Download:           'Download the selected file.',
				Edit:               'Edit the selected file. Open document directly from server for editing with associated application.',
				FileManager:        'Open this folder in Operating System\'s file manager.',
				Folders:            'Show or hide navigation tree.',
				Info:               'Show information about the selected item.',
				Lock:               'Lock the selected file. The item will be protected from modification. Note that you would not be able to edit the file as well.',
				Log:                'Show log. Send this log to administrator if you experience any issues, togather with a description and screenshots.',
				NewDocument:        'Create a new Microsoft Office document.',
				NewExcel:           'Create a new Microsoft Office Excel document.',
				NewFolder:          'Create a new folder',
				NewPowerPoint:      'Creates a new Microsoft Office PowerPoint document.',
				NewWord:            'Creates new Microsoft Office Word document.',
				OpenLocation:       'Navigate to folder that contains this file.',
				Paste:              'Paste the content of the buffer to the current location.',
				PauseUpload:        'Pause upload of the selected file(s).',
				RedoButton:         'Redo undone operation.',
				Refresh:            'Refresh content of this folder.',
				Rename:             'Rename the selected item.',
				RestartUpload:      'Restart file upload.',
				ResumeUpload:       'Resume upload of the selected file(s).',
				Undo:               'Undo previous operation.',
				Unlock:             'Unlock item.',
				Up:                 'Navigate one level up in the folder structure.',
				UpdateFile:         'Update file content. Your file will be overwritten with a selected file.',
				Upload:             'Upload files to selected folder.',
				UploadFolder:       'Upload local folder with all contained files to selected folder.',
                Versions:           'Manage file versions. Download previous file versions, delete and rollback to previous versions.',
				Views:              'Displays items using thumbnails or details view.',
				ViewsDetails:       'Displays items using details view.',
				ViewsMedium:        'Displays items using medium view.',
				ViewsLarge:         'Displays items using large view.',
				ViewsExtraLarge:    'Displays items using extra large view.',
				ViewError:          'Show upload errors.'
			}
		}
	},
	Exceptions: {
		ObjectExpected: 'Object or null expected.',
		UndefinedEventHandler: 'Event handler {0}::{1} is undefined.'
	}
};
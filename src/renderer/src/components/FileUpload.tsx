import React, { ChangeEvent, useEffect, useRef } from 'react';
import { useFileContext } from '../contexts/FileContext';
import { XMarkIcon } from '@heroicons/react/24/solid'

const acceptedFileTypes = ['.txt', '.srt'];
const acceptedFileTypesString: string = acceptedFileTypes.join(' ');

function FileUpload(): JSX.Element {
  const { selectedFile, updateSrc, resetFile } = useFileContext();

  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(fileOrEvent: File | ChangeEvent<HTMLInputElement>) {
    let file: File | null = null;

    if (fileOrEvent instanceof File) {
      file = fileOrEvent;
    } else if (fileOrEvent.target && fileOrEvent.target.files) {
      file = fileOrEvent.target.files[0];
    }

    if (file != null) {
      updateSrc(file);
    }
  };

  function handleDrop(event: React.DragEvent<HTMLInputElement>) {
    event.preventDefault();
    const files = event.dataTransfer.files;

    const invalidFiles: string[] = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileExtension = `.${file.name.split('.').pop()}`;
      if (!acceptedFileTypes.includes(fileExtension)) {
        invalidFiles.push(file.name);
      } else {
        // Handle the valid file (you can process it here)
        handleFileChange(file);
      }
    }

    if (invalidFiles.length > 0) {
      alert(`Invalid file type. Accepted filetypes: \n ${acceptedFileTypesString}`);
    }
  };


  function handleDragOver(event: React.DragEvent<HTMLInputElement>) {
    event.preventDefault();
    //TODO: Add visual indication for unaccepted filetype
  }

  return (
    <div>
      {selectedFile.path === ''
        ? <div className="upload border-2 border-slate-600 border-dotted ">
          <input
            className="block w-full text-sm text-slate-400
            file:mr-4 file:py-2 file:px-4
            file:border-0
            file:text-sm file:font-semibold
          file:bg-slate-600 file:text-white
           hover:file:bg-slate-500
           "
            ref={fileInputRef}
            type="file"
            accept={acceptedFileTypes.join(', ')}
            onChange={handleFileChange}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          />
        </div>
        : <div className='flex gap-4 items-center py-1 px-4 justify-between border-2 border-slate-600 border-dotted'>
          <p className='font-bold'>{selectedFile.name}</p>
          <button onClick={resetFile} className='bg-slate-700'>
            <XMarkIcon className='h-6 w-6 stroke-slate-200' />
          </button>
        </div>
      }
    </div>
  );
}

export default FileUpload;

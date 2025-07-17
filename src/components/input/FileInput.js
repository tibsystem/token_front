import React, { useRef, useState } from 'react';
import { FaFileAlt, FaTimes, FaFilePdf, FaFileWord, FaImage } from 'react-icons/fa';
import Image from 'next/image';




const FileInput = ({ label, accept, multiple = false, maxSizeMB = 5, maxImages = 5, onChange, id }) => {
  const inputRef = useRef();
  const [files, setFiles] = useState([]);
  const [descriptions, setDescriptions] = useState([]); 
  const [previews, setPreviews] = useState([]); 

  const handleFileChange = (e) => {
    const selected = Array.from(e.target.files);
    const oversized = selected.filter(file => file.size > maxSizeMB * 1024 * 1024);
    if (oversized.length > 0) {
      alert(`Arquivo(s) acima de ${maxSizeMB}MB não permitido(s).`);
      inputRef.current.value = '';
      return;
    }
    if (isImage) {
      // Concatenar novas imagens ao array existente
      const totalImages = files.length + selected.length;
      if (totalImages > maxImages) {
        alert(`Máximo de ${maxImages} imagens permitidas.`);
        inputRef.current.value = '';
        return;
      }
      const newFiles = [...files, ...selected];
      setFiles(newFiles);
      Promise.all(selected.map(file => {
        return new Promise(resolve => {
          const reader = new FileReader();
          reader.onload = e => resolve({ url: e.target.result, name: file.name });
          reader.readAsDataURL(file);
        });
      })).then(newPreviews => {
        setPreviews([...previews, ...newPreviews]);
      });
      if (onChange) onChange({ files: newFiles });
    } else {
      setFiles(selected);
      setDescriptions(selected.map(() => ""));
      setPreviews([]);
      if (onChange) onChange({ files: selected, descriptions: selected.map(() => "") });
    }
  };

  const removeFile = (index) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    if (!isImage) {
      const newDescriptions = descriptions.filter((_, i) => i !== index);
      setDescriptions(newDescriptions);
      if (onChange) onChange({ files: newFiles, descriptions: newDescriptions });
    }
    if (accept && accept.includes('image')) {
      setPreviews(previews.filter((_, i) => i !== index));
    }
    if (newFiles.length === 0 && inputRef.current) inputRef.current.value = '';
  };

  const handleDescriptionChange = (index, value) => {
    const newDescriptions = [...descriptions];
    newDescriptions[index] = value;
    setDescriptions(newDescriptions);
    if (onChange) onChange({ files, descriptions: newDescriptions });
  };

  const isImage = accept && accept.includes('image');

  return (
    <div>
      <input
        type="file"
        ref={inputRef}
        accept={accept}
        multiple={multiple}
        onChange={handleFileChange}
        className="d-none"
        id={id}
      />
      <label
        htmlFor={id}
        className="toggle-input toggle-button w-100 d-flex align-items-center justify-content-center gap-2"
        style={{ cursor: 'pointer' }}
      >
        {isImage ? <FaImage className="me-2" /> : <FaFileAlt className="me-2" />}
        {label}
      </label>
      {isImage && previews.length > 0 && (
        <div className="border-top pt-3">
          <h6 className="mb-3 text-center">Imagens Selecionadas ({previews.length})</h6>
          <div className="row g-2">
            {previews.map((preview, index) => (
              <div key={index} className="col-6">
                <div className="position-relative">
                  <Image
                    src={preview.url}
                    alt={`Preview ${index + 1}`}
                    className="img-fluid rounded-2 shadow-sm"
                    style={{ height: '100px', width: '100%', objectFit: 'cover' }}
                    width={150}
                    height={100}
                  />
                  <button
                    type="button"
                    className="btn btn-danger btn-sm position-absolute top-0 end-0 m-1 rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: '24px', height: '24px' }}
                    onClick={() => removeFile(index)}
                    title="Remover imagem"
                  >
                    <FaTimes size={10} />
                  </button>
                  <div className="mt-1">
                    <small className="text-muted text-truncate d-block" title={preview.name}>
                      {preview.name.length > 15 ? preview.name.substring(0, 15) + '...' : preview.name}
                    </small>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {!isImage && files.length > 0 && (
        <div className="border-top pt-3">
          <h6 className="mb-3 text-center">Arquivos Selecionados ({files.length})</h6>
          <div className="row g-3">
            {files.map((file, index) => {
              let icon = <FaFileAlt className="text-success" size={20} />;
              if (file.type === 'application/pdf') icon = <FaFilePdf className="text-danger" size={20} />;
              if (file.type === 'application/msword' || file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') icon = <FaFileWord className="text-primary" size={20} />;
              return (
                <div key={index} className="col-12">
                  <div className="card border-0 bg-light">
                    <div className="card-body p-3">
                      <div className="d-flex align-items-center gap-3 mb-2">
                        {icon}
                        <div className="flex-grow-1">
                          <small className="text-muted d-block fw-bold">{file.name}</small>
                          <small className="text-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</small>
                        </div>
                        <button
                          type="button"
                          className="btn btn-danger btn-sm d-flex align-items-center justify-content-center"
                          onClick={() => removeFile(index)}
                          title="Remover arquivo"
                        >
                          <FaTimes />
                        </button>
                      </div>
                      <div className="form-floating mt-2">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Descrição do arquivo"
                          value={descriptions[index] || ''}
                          onChange={e => handleDescriptionChange(index, e.target.value)}
                          id={`description-${index}`}
                        />
                        <label htmlFor={`description-${index}`}>Descrição do arquivo</label>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default FileInput;

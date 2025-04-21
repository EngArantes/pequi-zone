import React, { useState } from 'react';
import './STLuploadForm.css';

const STLUploadForm = () => {
    const [revisao, setRevisao] = useState(false);  // Estado para "Com revisão"
    const availableColors = ['#000000', '#ffffff', '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ffa500', '#800080']; // adicione suas cores reais aqui


    const [formData, setFormData] = useState({
        nome: '',
        email: '',
        telefone: '',
        descricao: '',
        material: '',
        cor: '',
        acabamento: '',
        arquivo: null,
    });

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (name === 'arquivo') {
            setFormData({ ...formData, arquivo: files[0] });
        } else {
            setFormData({ ...formData, [name]: value });
        }
    };

    const handleRevisaoChange = () => {
        setRevisao(!revisao);  // Alterna o estado do "Com revisão"
      };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Aqui você pode enviar o formData para seu backend ou Firebase
        console.log('Formulário enviado:', formData);
        alert('Arquivo enviado com sucesso!');
    };


    return (
        <div className="upload-form-container">
            <h2>Envie seu projeto 3D</h2>
            <form onSubmit={handleSubmit} className="upload-form">
                <input type="text" name="nome" placeholder="Seu nome*" required onChange={handleChange} />
                <input type="email" name="email" placeholder="Email*" required onChange={handleChange} />
                <input type="tel" name="telefone" placeholder="Telefone (opcional)" onChange={handleChange} />
                <textarea name="descricao" placeholder="Observação" required onChange={handleChange}></textarea>

                <select name="material" required onChange={handleChange}>
                    <option value="">Selecione o material*</option>
                    <option value="PLA">PLA</option>
                    <option value="PETG">PETG</option>
                </select>

                <div className="color-picker">
                    <label>Escolha a cor:</label>
                    <div className="color-options">
                        {availableColors.map((color) => (
                            <div
                                key={color}
                                className={`color-swatch ${formData.cor === color ? 'selected' : ''}`}
                                style={{ backgroundColor: color }}
                                onClick={() => setFormData({ ...formData, cor: color })}
                            ></div>
                        ))}
                    </div>
                </div>

                <select name="acabamento" required onChange={handleChange}>
                    <option defaultValue={"Bruto"}>Bruto (sem acabamento)</option>
                    <option value="Lixado">Lixado</option>
                    <option value="Pintado">Pintado</option>
                </select>

                <input
                    type="file"
                    name="arquivo"
                    accept=".stl"
                    required
                    onChange={handleChange}
                />

                <div className="form-group checkbox-group">
                    <label className="checkbox-label">
                        <input
                            type="checkbox"
                            checked={revisao}
                            onChange={handleRevisaoChange}
                        />
                        <strong>Com revisão </strong><p>&nbsp; (+ 5€)</p>
                    </label>
                </div>

                <button type="submit">Enviar Projeto</button>
            </form>
        </div>
    );
};

export default STLUploadForm;

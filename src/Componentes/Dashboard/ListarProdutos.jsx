import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './ListarProdutos.css';
import { useProduct } from '../../Contexts/ProductContext';
import ModalEditarProduto from './ModalEditProduct';

const ListarProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);
    const { deleteProduct, editProduct } = useProduct();
    const [modalAberto, setModalAberto] = useState(false);
    const [produtoEditando, setProdutoEditando] = useState(null);


    useEffect(() => {
        const fetchProdutos = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'produtos'));
                const produtosArray = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                setProdutos(produtosArray);
                setLoading(false);
            } catch (error) {
                console.error('Erro ao buscar produtos:', error);
                setLoading(false);
            }
        };

        fetchProdutos();
    }, []);


    const handleEdit = (produto) => {
        setProdutoEditando(produto);
        setModalAberto(true);
    };

    const handleSaveEdit = async (produtoAtualizado) => {
        await editProduct(produtoAtualizado);
        setProdutos(prev => prev.map(p => p.id === produtoAtualizado.id ? produtoAtualizado : p));
    };



    const handleDelete = async (id) => {
        if (window.confirm('Tem certeza que deseja deletar este produto?')) {
            await deleteProduct(id);
            setProdutos(prev => prev.filter(p => p.id !== id)); // Atualiza localmente
        }
    };

    if (loading) return <div>Carregando produtos...</div>;

    return (
        <div className="listar-produtos">
            <h2>Lista de Produtos</h2>
            <table>
                <thead>
                    <tr>
                        <th>Imagem</th>
                        <th>Nome</th>
                        <th>Preço</th>
                        <th>Ações</th>
                    </tr>
                </thead>
                <tbody>
                    {produtos.map((product) => (
                        <tr key={product.id}>
                            <td>
                                <img src={product.imagem} alt={product.nome} className="produto-thumb" />
                            </td>
                            <td>{product.nome}</td>
                            <td>€ {parseFloat(product.preco).toFixed(2)}</td>
                            <td>
                                <button onClick={() => handleEdit(product)} className="editar">Editar</button>
                                <button onClick={() => handleDelete(product.id)} className="excluir">
                                    Excluir
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {modalAberto && (
                <ModalEditarProduto
                    produto={produtoEditando}
                    onClose={() => setModalAberto(false)}
                    onSave={handleSaveEdit}
                />
            )}

        </div>
    );
};

export default ListarProdutos;

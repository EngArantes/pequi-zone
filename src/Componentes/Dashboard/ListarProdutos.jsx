import React, { useEffect, useState } from 'react';
import { db } from '../../firebaseConfig';
import { collection, getDocs } from 'firebase/firestore';
import './ListarProdutos.css';

const ListarProdutos = () => {
    const [produtos, setProdutos] = useState([]);
    const [loading, setLoading] = useState(true);

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
                    {produtos.map((produto) => (
                        <tr key={produto.id}>
                            <td>
                                <img src={produto.imagem} alt={produto.nome} className="produto-thumb" />
                            </td>
                            <td>{produto.nome}</td>
                            <td>€ {parseFloat(produto.preco).toFixed(2)}</td>
                            <td>
                                <button className="editar">Editar</button>
                                <button className="excluir">Excluir</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ListarProdutos;

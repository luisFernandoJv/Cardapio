import React, { useState } from 'react';
import PedidoForm from '../components/PedidoForm';
import Cupom from '../components/Cupom';

const Pedido = () => {
  const [pedidoInfo, setPedidoInfo] = useState(null);

  const handleSubmit = ({ cliente, pedido }) => {
    const id = `PEDIDO-${Math.floor(Math.random() * 100000)}`;
    setPedidoInfo({ id, cliente, pedido });
  };

  return (
    <div>
      <h1>Fazer Pedido</h1>
      {!pedidoInfo ? (
        <PedidoForm onSubmit={handleSubmit} />
      ) : (
        <Cupom {...pedidoInfo} />
      )}
    </div>
  );
};

export default Pedido;
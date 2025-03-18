// src/context/PedidosContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase";
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from "firebase/firestore";

const PedidosContext = createContext();

export const PedidosProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);

  // Carregar pedidos do Firestore em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const pedidosData = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPedidos(pedidosData);
    });

    return () => unsubscribe();
  }, []);

  // Adicionar um novo pedido ao Firestore
  const adicionarPedido = async (pedido) => {
    await addDoc(collection(db, "pedidos"), pedido);
  };

  // Atualizar o status de um pedido no Firestore
  const atualizarStatusPedido = async (id, status) => {
    const pedidoRef = doc(db, "pedidos", id);
    await updateDoc(pedidoRef, { status });
  };

  // Cancelar um pedido no Firestore
  const cancelarPedido = async (id) => {
    const pedidoRef = doc(db, "pedidos", id);
    await deleteDoc(pedidoRef);
  };

  return (
    <PedidosContext.Provider
      value={{ pedidos, adicionarPedido, atualizarStatusPedido, cancelarPedido }}
    >
      {children}
    </PedidosContext.Provider>
  );
};

export const usePedidos = () => useContext(PedidosContext);
import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../firebase"; // Importação correta
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";

// Crie o contexto
const PedidosContext = createContext();

// Exporte o Provider e o Hook personalizado
export const PedidosProvider = ({ children }) => {
  const [pedidos, setPedidos] = useState([]);

  // Carregar pedidos do Firestore em tempo real
  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, "pedidos"), (snapshot) => {
      const pedidosData = snapshot.docs.map((doc) => ({
        docId: doc.id, // ID real do documento
        ...doc.data(), // Campos do documento
      }));
      setPedidos(pedidosData);
    });

    return () => unsubscribe();
  }, []);

  // Adicionar um novo pedido ao Firestore
  const adicionarPedido = async (pedido) => {
    try {
      await addDoc(collection(db, "pedidos"), pedido);
      console.log("Pedido adicionado com sucesso!");
    } catch (error) {
      console.error("Erro ao adicionar pedido:", error);
    }
  };

  // Atualizar o status de um pedido no Firestore
  const atualizarStatusPedido = async (docId, status) => {
    if (!docId) {
      console.error("ID do documento não definido:", docId);
      return;
    }

    try {
      const pedidoRef = doc(db, "pedidos", docId); // Use o ID real do documento
      console.log("Tentando atualizar pedido com ID do documento:", docId); // Log para depuração

      // Verifique se o documento existe antes de atualizar
      const docSnapshot = await getDoc(pedidoRef);
      if (!docSnapshot.exists()) {
        console.error("Documento não encontrado com ID:", docId);
        return;
      }

      // Atualize o documento
      await updateDoc(pedidoRef, { status });
      console.log("Status do pedido atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar status do pedido:", error);
    }
  };

  // Cancelar um pedido no Firestore
  const cancelarPedido = async (docId) => {
    if (!docId) {
      console.error("ID do documento não definido:", docId);
      return;
    }

    try {
      const pedidoRef = doc(db, "pedidos", docId); // Use o ID real do documento
      console.log("Tentando cancelar pedido com ID do documento:", docId); // Log para depuração

      // Verifique se o documento existe antes de deletar
      const docSnapshot = await getDoc(pedidoRef);
      if (!docSnapshot.exists()) {
        console.error("Documento não encontrado com ID:", docId);
        return;
      }

      // Delete o documento
      await deleteDoc(pedidoRef);
      console.log("Pedido cancelado com sucesso!");
    } catch (error) {
      console.error("Erro ao cancelar pedido:", error);
    }
  };

  return (
    <PedidosContext.Provider
      value={{ pedidos, adicionarPedido, atualizarStatusPedido, cancelarPedido }}
    >
      {children}
    </PedidosContext.Provider>
  );
};

// Exporte o Hook personalizado
export const usePedidos = () => {
  const context = useContext(PedidosContext);
  if (!context) {
    throw new Error("usePedidos deve ser usado dentro de um PedidosProvider");
  }
  return context;
};
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Button,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Venda() {
  const [produtos, setProdutos] = useState([]);
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    carregarProdutos();
  }, []);

  const carregarProdutos = async () => {
    try {
      const json = await AsyncStorage.getItem('@produtos');
      if (json) {
        setProdutos(JSON.parse(json));
      }
    } catch (error) {
      Alert.alert('Erro ao carregar produtos');
    }
  };

  const registrarVenda = async (produto: any) => {
    const novaVenda = {
      id: Date.now().toString(),
      nome: produto.nome,
      preco: produto.preco,
      data: new Date().toLocaleString(),
    };

    const novaLista = [...vendas, novaVenda];
    setVendas(novaLista);

    try {
      await AsyncStorage.setItem('@vendas', JSON.stringify(novaLista));
      Alert.alert('Venda registrada com sucesso!');
    } catch (error) {
      Alert.alert('Erro ao registrar venda');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Registrar Vendas</Text>

      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.nome} - R$ {item.preco.toFixed(2)}</Text>
            <Button title="Vender" onPress={() => registrarVenda(item)} />
          </View>
        )}
        ListEmptyComponent={<Text>Nenhum produto disponível</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  item: {
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
});

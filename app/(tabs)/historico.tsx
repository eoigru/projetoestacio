import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Historico() {
  const [vendas, setVendas] = useState([]);

  useEffect(() => {
    carregarVendas();
  }, []);

  const carregarVendas = async () => {
    try {
      const json = await AsyncStorage.getItem('@vendas');
      if (json) {
        setVendas(JSON.parse(json));
      }
    } catch (error) {
      Alert.alert('Erro ao carregar histórico de vendas');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Histórico de Vendas</Text>

      {vendas.length === 0 ? (
        <Text style={styles.mensagem}>Nenhuma venda registrada.</Text>
      ) : (
        <FlatList
          data={vendas}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.nome} - R$ {item.preco.toFixed(2)}</Text>
              <Text>Data da venda: {item.data}</Text>
            </View>
          )}
        />
      )}
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
  mensagem: { fontSize: 18, color: '#888', textAlign: 'center' },
});

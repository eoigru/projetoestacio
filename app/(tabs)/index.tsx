import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  Button,
  FlatList,
  StyleSheet,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';

export default function Cadastro() {
  const [produto, setProduto] = useState('');
  const [preco, setPreco] = useState('');
  const [produtos, setProdutos] = useState([]);

  const router = useRouter(); // ✅ Expo Router navigation

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

  const salvarProdutos = async (dados: any[]) => {
    try {
      await AsyncStorage.setItem('@produtos', JSON.stringify(dados));
    } catch (error) {
      Alert.alert('Erro ao salvar produto');
    }
  };

  const adicionarProduto = () => {
    if (!produto || !preco) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    const novoProduto = {
      id: Date.now().toString(),
      nome: produto,
      preco: parseFloat(preco),
    };

    const novaLista = [...produtos, novoProduto];
    setProdutos(novaLista);
    salvarProdutos(novaLista);

    setProduto('');
    setPreco('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Cadastro de Produtos</Text>

      <TextInput
        placeholder="Nome do produto"
        value={produto}
        onChangeText={setProduto}
        style={styles.input}
      />

      <TextInput
        placeholder="Preço"
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button title="Adicionar Produto" onPress={adicionarProduto} />

      <Text style={styles.subtitulo}>Produtos cadastrados:</Text>
      <FlatList
        data={produtos}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            {item.nome} - R$ {item.preco.toFixed(2)}
          </Text>
        )}
      />

      <View style={{ marginTop: 20 }}>
        <Button
          title="Ir para Registro de Vendas"
          onPress={() => router.push('/venda')}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, marginTop: 40 },
  titulo: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  subtitulo: { marginTop: 20, fontSize: 18, fontWeight: 'bold' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
  },
  item: {
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
});

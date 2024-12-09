import { MaterialIcons } from "@expo/vector-icons";
import React, { useReducer, useState } from "react";
import {
  Alert,
  Button,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

interface Todo {
  id: number;
  title: string;
  complete: boolean;
  delete: boolean;
}

type Action =
  | { type: "COMPLETE"; id: number }
  | { type: "DELETE"; id: number }
  | { type: "REMOVE"; id: number }
  | { type: "ADD"; todoText: string };

const initialTodos: Todo[] = [
  { id: 1, title: "Todo 1", complete: false, delete: false },
  { id: 2, title: "Todo 2", complete: false, delete: false },
  { id: 3, title: "Todo 3", complete: false, delete: false },
  { id: 4, title: "Todo 4", complete: false, delete: true },
];

const reducer = (state: Todo[], action: Action): Todo[] => {
  switch (action.type) {
    case "COMPLETE":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, complete: !todo.complete } : todo
      );
    case "DELETE":
      return state.map((todo) =>
        todo.id === action.id ? { ...todo, delete: !todo.delete } : todo
      );
    case "REMOVE":
      return state.filter((todo) => todo.id !== action.id);
    case "ADD":
      return [
        ...state,
        {
          id: Math.floor(Math.random() * 100),
          title: action.todoText,
          complete: false,
          delete: false,
        },
      ];
    default:
      return state;
  }
};

export default function Todos() {
  const [todos, dispatch] = useReducer(reducer, initialTodos);
  const [todoText, setTodoText] = useState<string>("");

  const handleComplete = (id: number) => {
    dispatch({ type: "COMPLETE", id });
  };

  const handleDelete = (item: Todo) => {
    const id = item.id;
    if (!item.delete) {
      dispatch({ type: "DELETE", id });
    } else {
      Alert.alert("Apagar", "Tem a certeza que quer remover?", [
        {
          text: "Confirmar",
          onPress: () => handleRemove(id),
        },
        {
          text: "Cancelar",
          style: "cancel",
        },
      ]);
    }
  };

  const handleRemove = (id: number) => {
    dispatch({ type: "REMOVE", id });
  };

  const handleAddTodo = (todoText: string) => {
    if (todoText.trim()) {
      dispatch({ type: "ADD", todoText });
      setTodoText("");
    }
  };

  const renderItem = ({ item }: { item: Todo }) => (
    <View style={styles.itemStyle}>
      <Pressable onPress={() => handleComplete(item.id)}>
        {({ pressed }) => (
          <MaterialIcons
            name={item.complete ? "check-box" : "check-box-outline-blank"}
            size={30}
            color={item.complete ? "green" : pressed ? "gray" : "black"}
          />
        )}
      </Pressable>
      <Text style={item.complete ? [styles.text, styles.riscado] : styles.text}>
        {item.title}
      </Text>
      <Pressable onPress={() => handleDelete(item)}>
        {({ pressed }) => (
          <MaterialIcons
            name={item.delete ? "delete" : "delete-outline"}
            size={30}
            color={pressed ? "gray" : "red"}
          />
        )}
      </Pressable>
    </View>
  );

  return (
    <>
      <View style={styles.appContainer}>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={todoText}
            onChangeText={setTodoText}
          />
          <Button
            onPress={() => handleAddTodo(todoText)}
            title="Adicionar"
            color="#841584"
          />
        </View>
        <View style={styles.todoContainer}>
          <FlatList
            data={todos.filter((item) => !item.delete)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
      <View style={styles.garbageContainer}>
        <Text style={styles.garbageTitle}>Eliminados</Text>
      </View>
      <View style={styles.appContainer}>
        <View style={styles.todoContainer}>
          <FlatList
            data={todos.filter((item) => item.delete)}
            renderItem={renderItem}
            keyExtractor={(item) => item.id.toString()}
          />
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  appContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 16,
  },
  todoContainer: {
    flex: 1,
    borderBottomWidth: 1,
  },
  itemStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  input: {
    borderWidth: 1,
    borderColor: "black",
    height: 40,
    width: 250,
    borderRadius: 9,
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  garbageContainer: {
    marginHorizontal: 15,
    marginTop: 10,
  },
  garbageTitle: {
    color: "#ff0000",
  },
  text: {
    flex: 1,
    marginLeft: 10,
  },
  riscado: {
    textDecorationLine: "line-through",
  },
});

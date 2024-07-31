import { StyleSheet, Text, View, TextInput } from 'react-native'
import React, { useState } from 'react';

const Forgotpassword = () => {
  const [email, setEmail] = useState('');
  return (
    <View>
      <Text style={styles.title} >Enter your Username or Email</Text>
      <TextInput
        style={styles.input}
        onChangeText={setEmail}
        value={email}
        placeholder="Email"
        keyboardType="email-address"
        autoCapitalize="none"
      />
    </View>
  )
}

export default Forgotpassword

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#000000',
  },
  input: {
    width: '80%',
    height: 50,
    margin: 12,
    borderWidth: 1,
    borderColor: '#dcdcdc',
    borderRadius: 5,
    padding: 10,
    backgroundColor: '#f5f5f5',
  },

})
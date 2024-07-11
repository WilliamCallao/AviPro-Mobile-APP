import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, TextInput } from 'react-native';
import { theme } from '../../assets/Theme';
import StyledText from '../../utils/StyledText';
import Icon from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import axios from 'axios';
import { BASE_URL } from '../../../config';
import useNotasCobradasStore from '../../stores/notasCobradasStore';

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const PaidNoteItem = ({ note, onEdit, onDelete }) => {
  // console.log("----Paid-Note-Item----");
  // console.log(JSON.stringify(note, null, 2));
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [monto, setMonto] = useState(note.monto.toString());
  const [observaciones, setObservaciones] = useState(note.observaciones || '');

  const { removeNotaCobrada, editNotaCobrada } = useNotasCobradasStore();

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const today = new Date();
    const formattedDate = date.toLocaleDateString("es-ES", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
    const isToday = date.toDateString() === today.toDateString();
    return isToday ? `${formattedDate} (hoy)` : formattedDate;
  };

  const getPaymentMode = (mode) => {
    return mode === 'E' ? 'Efectivo' : 'Banco';
  };

  const handleDelete = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await axios.delete(`${BASE_URL}/api/mobile/notas/notas-cobradas/delete`, {
        data: {
          empresa_id: note.empresa_id,
          sucursal_id: note.sucursal_id,
          cuenta: note.cuenta,
          pago_a_nota: note.pago_a_nota,
          fecha_registro: note.fecha_registro
        }
      });
      if (response.status === 200) {
        setSuccessMessage('Nota cobrada eliminada correctamente');
        setIsProcessing(false);
        await wait(1000);
        setIsModalVisible(false);
        onDelete(note);
        removeNotaCobrada(note.pago_a_nota);
      } else {
        throw new Error('Failed to delete the note');
      }
    } catch (error) {
      setIsProcessing(false);
      setSuccessMessage('');
      Alert.alert('Error', 'Ocurrió un error al eliminar la nota cobrada');
      console.error('Error deleting paid note:', error);
    }
  };

  const handleEdit = async () => {
    if (isProcessing) return;

    setIsProcessing(true);
    try {
      const response = await axios.put(`${BASE_URL}/api/mobile/notas/notas-cobradas/edit`, {
        empresa_id: note.empresa_id,
        sucursal_id: note.sucursal_id,
        cuenta: note.cuenta,
        pago_a_nota: note.pago_a_nota,
        fecha_registro: note.fecha_registro,
        monto,
        observaciones
      });
      if (response.status === 200) {
        setSuccessMessage('Nota cobrada editada correctamente');
        setIsProcessing(false);
        await wait(1000);
        setIsEditModalVisible(false);
        onEdit({ ...note, monto, observaciones });
        editNotaCobrada({ ...note, monto, observaciones });
      } else {
        throw new Error('Failed to edit the note');
      }
    } catch (error) {
      setIsProcessing(false);
      setSuccessMessage('');
      Alert.alert('Error', 'Ocurrió un error al editar la nota cobrada');
      console.error('Error editing paid note:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StyledText boldText>{note.pago_a_nota}</StyledText>
        <StyledText money>{note.monto} Bs</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Fecha de cobro:</StyledText>
        <StyledText regularText>{formatDate(note.fecha)}</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Modo de Pago:</StyledText>
        <StyledText regularText>{getPaymentMode(note.modo_pago)}</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Número de Factura:</StyledText>
        <StyledText regularText>{note.nro_factura}</StyledText>
      </View>
      <View style={styles.textLine}>
        <StyledText regularText>Observaciones:</StyledText>
        <StyledText regularText>{note.observaciones || 'N/A'}</StyledText>
      </View>
      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.button} onPress={() => setIsEditModalVisible(true)}>
          <Icon name="edit" size={20} color={theme.colors.primary} />
          <StyledText regularText style={styles.buttonText}>Editar</StyledText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setIsModalVisible(true)}>
          <Icon name="delete" size={20} color={theme.colors.red} />
          <StyledText regularText style={styles.buttonText}>Eliminar</StyledText>
        </TouchableOpacity>
      </View>

      <Modal isVisible={isModalVisible} backdropColor="#9DBBE2" backdropOpacity={0.4}>
        <View style={[styles.modalContent, styles.modalShadow]}>
          {isProcessing ? (
            <>
              <ActivityIndicator size="large" color={theme.colors.black} />
              <StyledText regularText style={styles.modalText}>Eliminando nota...</StyledText>
            </>
          ) : (
            successMessage ? (
              <>
                <Icon name="checkcircle" size={50} color="green" />
                <StyledText regularBlackText style={styles.modalText}>{successMessage}</StyledText>
              </>
            ) : (
              <>
                <StyledText regularBlackText style={styles.modalText}>¿Está seguro de eliminar esta nota cobrada?</StyledText>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: 'red' }]}
                    onPress={() => setIsModalVisible(false)}
                  >
                    <StyledText style={styles.modalButtonText}>Cancelar</StyledText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: 'green' }]}
                    onPress={handleDelete}
                  >
                    <StyledText style={styles.modalButtonText}>Confirmar</StyledText>
                  </TouchableOpacity>
                </View>
              </>
            )
          )}
        </View>
      </Modal>

      <Modal isVisible={isEditModalVisible} backdropColor="#9DBBE2" backdropOpacity={0.4}>
        <View style={[styles.modalContent, styles.modalShadow]}>
          {isProcessing ? (
            <>
              <ActivityIndicator size="large" color={theme.colors.black} />
              <StyledText regularText style={styles.modalText}>Editando nota...</StyledText>
            </>
          ) : (
            successMessage ? (
              <>
                <Icon name="checkcircle" size={50} color="green" />
                <StyledText regularBlackText style={styles.modalText}>{successMessage}</StyledText>
              </>
            ) : (
              <>
                <StyledText regularBlackText style={styles.modalText}>Editar Nota Cobrada</StyledText>
                <View style={styles.inputContainer}>
                  <StyledText regularText style={styles.inputLabel}>Monto:</StyledText>
                  <TextInput
                    style={styles.input}
                    value={monto}
                    onChangeText={setMonto}
                    keyboardType="numeric"
                  />
                </View>
                <View style={styles.inputContainer}>
                  <StyledText regularText style={styles.inputLabel}>Observaciones:</StyledText>
                  <TextInput
                    style={styles.input}
                    value={observaciones}
                    onChangeText={setObservaciones}
                  />
                </View>
                <View style={styles.modalButtonContainer}>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: 'red' }]}
                    onPress={() => setIsEditModalVisible(false)}
                  >
                    <StyledText style={styles.modalButtonText}>Cancelar</StyledText>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.modalButton, { backgroundColor: 'green' }]}
                    onPress={handleEdit}
                  >
                    <StyledText style={styles.modalButtonText}>Confirmar</StyledText>
                  </TouchableOpacity>
                </View>
              </>
            )
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.primary,
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 20,
    marginVertical: 8,
    marginHorizontal: 20,
    borderWidth: 2,
    borderRadius: 20,
    borderColor: theme.colors.otherWhite,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 1,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 15,
    width: '48%',
    justifyContent: 'center',
  },
  buttonText: {
    marginLeft: 5,
    color: theme.colors.primaryText,
  },
  modalContent: {
    backgroundColor: theme.colors.primary,
    padding: 20,
    borderRadius: 25,
    alignItems: 'center',
  },
  modalText: {
    marginVertical: 10,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  modalButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 5,
    marginHorizontal: 5,
  },
  modalButtonText: {
    color: 'white',
    textAlign: 'center',
  },
  modalShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowOpacity: 0.75,
    shadowRadius: 10,
    elevation: 90,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  inputLabel: {
    flex: 1,
    marginRight: 10,
  },
  input: {
    flex: 2,
    padding: 10,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: theme.colors.secondaryText,
    color: theme.colors.black,
  },
});

export default PaidNoteItem;

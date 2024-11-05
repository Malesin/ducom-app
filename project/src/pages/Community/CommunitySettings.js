import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  TextInput,
  Image,
  Animated,
  TouchableWithoutFeedback,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import ImagePicker from 'react-native-image-crop-picker';
import { useNavigation } from '@react-navigation/native';

const CommunitySettings = () => {
  const navigation = useNavigation();
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingBio, setIsEditingBio] = useState(false);
  const [communityName, setCommunityName] = useState('Gerakan Pramuka Dugam');
  const [communityBio, setCommunityBio] = useState('Lorem Ipsum is simply dummy text of the printing and typesetting industry...');
  const [banner, setBanner] = useState(require('../../assets/iya.png'));
  const [profilePicture, setProfilePicture] = useState(require('../../assets/avatar.png'));
  const [profileBackground, setProfileBackground] = useState(null);
  const [dropdownVisible, setDropdownVisible] = useState(false);
  const dropdownAnimation = useRef(new Animated.Value(0)).current;

  const toggleEditing = (field) => {
    if (field === 'name') {
      setIsEditingName(!isEditingName);
      if (isEditingBio) setIsEditingBio(false);
    } else if (field === 'bio') {
      setIsEditingBio(!isEditingBio);
      if (isEditingName) setIsEditingName(false);
    }
  };

  const saveCommunityBio = () => {
    // Logic to save community bio
    setIsEditingBio(false);
  };

  const selectImage = (setImage) => {
    ImagePicker.openPicker({
      width: 400,
      height: 400,
      cropping: true,
      mediaType: 'photo',
    })
      .then(image => {
        console.log('Image selected:', image);
        setImage({ uri: image.path });
      })
      .catch(error => {
        console.error('Error selecting image:', error);
      });
  };

  const toggleDropdown = () => {
    if (dropdownVisible) {
      Animated.timing(dropdownAnimation, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }).start(() => setDropdownVisible(false));
    } else {
      setDropdownVisible(true);
      Animated.timing(dropdownAnimation, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }).start();
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.bannerContainer}>
        <ImageBackground
          source={banner}
          style={styles.banner}
          resizeMode="cover"
          imageStyle={styles.bannerImage}
        >
          <TouchableOpacity style={styles.editIcon} onPress={() => selectImage(setBanner)}>
            <MaterialCommunityIcons name="pencil" size={24} color="#fff" />
          </TouchableOpacity>
          <View style={styles.avatarContainer}>
            <Image
              source={profilePicture}
              style={styles.avatar}
            />
            <TouchableOpacity style={styles.avatarEditIcon} onPress={() => selectImage(setProfilePicture)}>
              <MaterialCommunityIcons name="pencil" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </ImageBackground>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Community Account</Text>
        <View style={styles.infoContainer}>
          <View style={styles.infoRow}>
            {isEditingName ? (
              <TextInput
                style={styles.infoText}
                value={communityName}
                onChangeText={setCommunityName}
                autoFocus={true}
              />
            ) : (
              <Text style={styles.infoText}>{communityName}</Text>
            )}
            {isEditingName ? (
              <TouchableOpacity style={styles.saveButtonInline} onPress={() => toggleEditing('name')}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => toggleEditing('name')}>
                <MaterialCommunityIcons name="chevron-right" size={25} color="#000" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.label}>Community Name</Text>
        </View>
        <View style={styles.bioContainer}>
          <View style={styles.infoRow}>
            {isEditingBio ? (
              <TextInput
                style={styles.bioText}
                value={communityBio}
                onChangeText={setCommunityBio}  
                autoFocus={true}
                multiline={true}
              />
            ) : (   
              <Text style={styles.bioText}>{communityBio}</Text>
            )}
            {isEditingBio ? (
              <TouchableOpacity style={styles.saveButtonInline} onPress={() => toggleEditing('bio')}>
                <Text style={styles.saveButtonText}>Save</Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => toggleEditing('bio')}>
                <MaterialCommunityIcons name="chevron-right" size={25} color="#000" />
              </TouchableOpacity>
            )}
          </View>
          <Text style={styles.label}>Bio</Text>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Profile Background</Text>
        <View style={styles.profileBackground}>
          {profileBackground && (
            <ImageBackground
              source={profileBackground}
              style={{ width: '100%', height: 200 }}
              resizeMode="cover"
            />
          )}
        </View>
        <TouchableOpacity style={styles.galleryButton} onPress={() => selectImage(setProfileBackground)}>
          <MaterialCommunityIcons name="image-outline" size={24} color="#000" />
          <Text style={styles.galleryButtonText}>Select from Gallery</Text>
        </TouchableOpacity>
        <View style={styles.lineSeparator} />
      </View>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Community Rules</Text>
          <TouchableOpacity onPress={toggleDropdown}>
            <MaterialCommunityIcons name="dots-horizontal" size={30} color="#000" />
          </TouchableOpacity>
        </View>
        {dropdownVisible && (
          <View style={styles.dropdownMenu}>
            <TouchableOpacity style={styles.dropdownItem}>
              <MaterialCommunityIcons name="pencil" size={20} color="#000" style={styles.dropdownIcon} />
              <Text style={styles.dropdownItemText}>Edit Rules</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.dropdownItem}>
              <MaterialCommunityIcons name="delete" size={20} color="red" style={styles.dropdownIcon} />
              <Text style={styles.dropdownItemText}>Delete Rules</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={styles.rulesContainer}>
          <View style={styles.ruleRow}>
            <View style={styles.ruleIcon}>
              <Text style={styles.ruleNumber}>1</Text>
            </View>
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>Be kind and respectful.</Text>
              <Text style={styles.ruleDescription}>Not everyone is on the same technical level. Respect and encourage the questions of others.</Text>
            </View>
          </View>
          <View style={styles.ruleRow}>
            <View style={styles.ruleIcon}>
              <Text style={styles.ruleNumber}>2</Text>
            </View>
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>Keep post on topic.</Text>
              <Text style={styles.ruleDescription}>Stay on topic. Do not hijack another user's thread.</Text>
            </View>
          </View>
          <View style={styles.ruleRow}>
            <View style={styles.ruleIcon}>
              <Text style={styles.ruleNumber}>3</Text>
            </View>
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>No selling or promoting.</Text>
              <Text style={styles.ruleDescription}>No selling or promoting of any kind. This is strictly a technical support group only.</Text>
            </View>
          </View>
          <View style={styles.ruleRow}>
            <View style={styles.ruleIcon}>
              <Text style={styles.ruleNumber}>4</Text>
            </View>
            <View style={styles.ruleTextContainer}>
              <Text style={styles.ruleTitle}>Explore and share.</Text>
              <Text style={styles.ruleDescription}>Explore ideas and share knowledge.</Text>
            </View>
          </View>
        </View>
        <View style={styles.lineSeparator} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User Account</Text>
        <TouchableOpacity
          style={styles.userAccountContainer}
          onPress={() => navigation.navigate('CommunityList')}
        >
          <MaterialCommunityIcons name="shield-account" size={26} color="#000" />
          <Text style={styles.userAccountText}>User List</Text>
          <View style={{ flex: 1, alignItems: 'flex-end' }}>
            <MaterialCommunityIcons name="chevron-right" size={25} color="#000" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Delete Community</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
    padding: 17,
  },
  bannerContainer: {
    width: '100%',
    height: 150,
    marginBottom: 20,
  },
  banner: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-start',
    alignItems: 'flex-end',
  },
  bannerImage: {
    borderRadius: 20,
  },
  editIcon: {
    padding: 10,
  },
  infoContainer: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  bioContainer: {
    paddingVertical: 15,
    paddingHorizontal: 12,
    borderBottomWidth: 4,
    borderBottomColor: '#D9D9D9',

  },
  section: {
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 19,
    fontWeight: 'bold',
    color: '#001374',
    marginBottom: 2,
  },
  label: {
    fontSize: 12,
    color: '#686868',
    marginTop: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
    infoText: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  bioText: {
    fontSize: 14,
    color: '#000',
    flex: 1,
  },
  profileBackground: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 1,
  },
  galleryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginBottom: 5,
  },
  galleryButtonText: {
    color: '#000000',
    marginLeft: 8,    
  },
  rulesContainer: {
    paddingLeft: 10,
    marginBottom: 10,
  },
  rule: {
    fontSize: 14,
    marginBottom: 5,
  },
  separator: {
    height: 1,
    backgroundColor: '#ccc',
    marginVertical: 10,
  },
  saveButtonInline: {
    backgroundColor: '#001374',
    paddingHorizontal: 15,
    borderRadius: 30,
    paddingVertical: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  lineSeparator: {
    borderBottomWidth: 4,
    borderBottomColor: '#D9D9D9',
    marginVertical: 3,
  },
  userAccountContainer: {
    flexDirection: 'row',
    paddingLeft: 10,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
  },
  userAccountText: {
    fontSize: 16,
    color: '#000',
    fontWeight: 'bold',
    marginLeft: 8,
  },
  deleteButton: {
    backgroundColor: '#D3D3D3',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  deleteButtonText: {
    color: '#B62A2A',
    fontWeight: 'bold',
    fontSize: 17,
  },
  avatar: {

    bottom: -15,
    left: '54%',
    transform: [{ translateX: -50 }],
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 3,
    borderColor: '#fff',
  },
  avatarContainer: {
    position: 'absolute',
    bottom: -3,
    left: '54%',
    transform: [{ translateX: -50 }],
    alignItems: 'center',
  },
  avatarEditIcon: {
    position: 'absolute',
    bottom: -10,
    right: 0,
    backgroundColor: '#d3d3d3',
    borderRadius: 10,
    padding: 2,
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  ruleIcon: {
    width: 30,
    height: 30,
  },
  ruleNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000a',
  },
  ruleTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000000',
    marginBottom: 5,
  },
  ruleDescription: {
    fontSize: 14,
    color: '#686868',
  },
  ruleTextContainer: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  dropdownMenu: {
    backgroundColor: '#fff',
    borderRadius: 10,
    width: 180,
    padding: 10,
    position: 'absolute',
    top: 50,
    right: 10,
    zIndex: 1,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  dropdownIcon: {
    marginRight: 10,
  },
  dropdownItemText: {
    fontSize: 15,
    color: '#000',
  },
});

export default CommunitySettings;
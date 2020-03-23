import React, { useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import { ListItem } from "react-native-elements";
import Modal from "../Modal";
import ChangeNameForm from "../Account/ChangeNameForm";
import ChangeEmailForm from "../Account/ChangeEmailForm";
import ChangePasswordForm from "../Account/ChangePasswordForm";

export default function AccountOptions(props) {
  const { userInfo, setReloadData, toastRef } = props;
  const [isVisibleModal, setIsVisibleModal] = useState(false);
  const [renderComp, setRenderComp] = useState(null);

  const MenuOptions = [
    {
      title: "Change Name and Last Name",
      iconType: "material-community",
      iconNameLeft: "account-circle",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectedComp("displayName")
    },
    {
      title: "Change Email",
      iconType: "material-community",
      iconNameLeft: "at",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectedComp("email")
    },
    {
      title: "Change Password",
      iconType: "material-community",
      iconNameLeft: "lock-reset",
      iconColorLeft: "#ccc",
      iconNameRight: "chevron-right",
      iconColorRight: "#ccc",
      onPress: () => selectedComp("password")
    }
  ];

  const selectedComp = key => {
    switch (key) {
      case "displayName":
        setRenderComp(
          <ChangeNameForm
            setIsVisibleModal={setIsVisibleModal}
            setReloadData={setReloadData}
            toastRef={toastRef}
            displayName={userInfo.displayName}
          />
        );
        setIsVisibleModal(true);
        break;
      case "email":
        setRenderComp(
          <ChangeEmailForm
            setIsVisibleModal={setIsVisibleModal}
            setReloadData={setReloadData}
            toastRef={toastRef}
            email={userInfo.email}
          />
        );
        setIsVisibleModal(true);
        break;
      case "password":
        setRenderComp(
          <ChangePasswordForm
            setIsVisibleModal={setIsVisibleModal}
            setReloadData={setReloadData}
            toastRef={toastRef}
            password={userInfo.password}
          />
        );
        setIsVisibleModal(true);
        break;
      default:
        break;
    }
  };

  return (
    <View>
      {/* usamos parentesis en vez de corchetes xq asi nos evitamos tener que poner un return */}
      {MenuOptions.map((elm, idx) => (
        <ListItem
          key={idx}
          title={elm.title}
          leftIcon={{
            type: elm.iconType,
            name: elm.iconNameLeft,
            color: elm.iconColorLeft
          }}
          rightIcon={{
            type: elm.iconType,
            name: elm.iconNameRight,
            color: elm.iconColorRight
          }}
          onPress={elm.onPress}
          containerStyle={styles.menuItem}
        />
      ))}

      {renderComp && (
        <Modal isVisible={isVisibleModal} setIsVisible={setIsVisibleModal}>
          {renderComp}
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  menuItem: {
    borderBottomWidth: 1,
    borderBottomColor: "#e3e3e3"
  }
});

import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { Input, Button } from "react-native-elements";
import * as firebase from "firebase";

export default function ChangeEmailForm(props) {
    const { password, setIsVisibleModal, setReloadData, toastRef } = props;
    const [newPassword, setNewPassword] = useState(null);
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const updatePassword = () => {
        setError(null);
        if (!newPassword) {
            setError("The password has not change");
        } else {
            setIsLoading(true);
            const update = {
                password: newPassword
            };
            firebase
                .auth()
                .currentUser.updateProfile(update)
                .then(() => {
                    setIsLoading(false);
                    setReloadData(true); //actualiza la informacion del usuario en pantalla
                    toastRef.current.show("password has been updated");
                    setIsVisibleModal(false);
                })
                .catch(() => {
                    setError("error updating");
                    setIsLoading(false);
                });
        }
    };

    return (
        <View style={styles.view}>
            <Input
                placeholder="Password"
                containerStyle={styles.input}
                defaultValue={password && password} //la condicion dice que si existe displayName añademe displayName
                onChange={elm => setNewEmail(elm.nativeEvent.text)}
                rightIcon={{
                    type: "material-community",
                    name: "at",
                    color: "#c2c2c2"
                }}
                errorMessage={error}
            />
            <Button
                title="Password Change"
                containerStyle={styles.btnCont}
                buttonStyle={styles.btn}
                onPress={updatePassword}
                loading={isLoading}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        alignItems: "center",
        paddingTop: 10,
        paddingBottom: 10
    },
    input: {
        marginBottom: 10
    },
    btnCont: {
        marginTop: 20,
        width: "95%"
    },
    btn: {
        backgroundColor: "#00a680"
    }
});
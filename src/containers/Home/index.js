import React from 'react';
import { View, StyleSheet, Text, TextInput } from 'react-native';
import RawData from '../../assets/Input/leaderboard.json';
import { Table, Row } from 'react-native-table-component';
import { deviceWidth } from '../../themes/metrics';

const tblColWidth = [deviceWidth * 0.355, deviceWidth * 0.155, deviceWidth * 0.2, deviceWidth * 0.2];
const tblHead = ['Name', 'Rank', 'Number of bananas', 'isCurrentUser?'];

export default class Home extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            topTenUserList: [],
            currentUserObj: null,
            isInTopTenUser: false,
            inputUser: 'x8RNvUgv5pZqDVatEXb2aYgSflq1',
            tblData: null,
        };
    }

    componentDidMount = () => {
    }

    onChangeNumber = (inputText) => {
        this.setState({ inputUser: inputText }, () => {
            this.onCalculateRank();
        });
    }

    onCalculateRank = () => {
        const { inputUser } = this.state;

        const rawDataList = Object.values(RawData); // check with raw data first for performance
        const currentUserObj = rawDataList.find(rawDataListItem => rawDataListItem.uid === inputUser);

        if (currentUserObj) {
            //sort and add prop in UserList
            const sortedUserList = rawDataList.sort(function (a, b) { return (b.bananas - a.bananas) })
                .map((user, index) => {
                    user.rank = index + 1;
                    user.isCurrentUser = user.uid === currentUserObj.uid ? 'yes' : 'no';
                    return user;
                });

            //switch user if current user is not in top ten user list
            const indexOfCurrentUser = sortedUserList.indexOf(currentUserObj);
            if (indexOfCurrentUser >= 9) {
                sortedUserList.splice(9, 0, sortedUserList.splice(indexOfCurrentUser, 1)[0]);
                this.setState({isInTopTenUser: false})
            } else this.setState({isInTopTenUser: true});

            //splice top ten
            const topTenUserList = sortedUserList.splice(0, 10);

            //prepare table data
            const tblData = topTenUserList.map((user) =>
                [user.name, user.rank, user.bananas, user.isCurrentUser]
            );

            this.setState({
                topTenUserList: topTenUserList,
                tblData: tblData,
                currentUserObj: currentUserObj
            });

        } else {
            this.setState({ topTenUserList: [] });
        }
    }

    render() {
        const {
            topTenUserList,
            inputUser,
            tblData,
            currentUserObj,
            isInTopTenUser
        } = this.state;
        return (
            <View style={styles.container} >
                <TextInput
                    style={styles.txtInput}
                    onChangeText={(text) => this.onChangeNumber(text)}
                    value={inputUser}
                    placeholder="Enter Current UserId"
                />
                {topTenUserList.length > 0 ? (
                    <View>
                        <Text style={styles.txt}>Current user {currentUserObj.name} is {isInTopTenUser ? '' : 'NOT'} in the top 10.</Text>
                        <Table borderStyle={{ borderWidth: 2, borderColor: '#c8e1ff' }}>
                            <Row widthArr={tblColWidth} data={tblHead} style={styles.tblTitle} textStyle={styles.tblTitleTxt} />
                            {tblData.map((user, index) => (
                                <Row
                                    index={index}
                                    widthArr={tblColWidth}
                                    data={user}
                                    style={styles.tblBody}
                                    textStyle={user[3] === 'no' ? styles.tblBodyTxt : styles.tblBodyTxtActive}
                                />
                            ))}
                        </Table>
                    </View>
                ) : (
                    <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                        {inputUser ? (
                            <Text>Current user id does not exist! Please specify an existing user id!</Text>
                        ) : null}
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: deviceWidth * 0.045
    },
    txt: {
        marginBottom: 10,
        fontWeight: 'bold'
    },
    txtInput: {
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
        borderColor: '#c8e1ff'
    },
    tblTitle: {
        height: 50,
        backgroundColor: '#f1f8ff'
    },
    tblTitleTxt: {
        textAlign: 'center'
    },
    tblBody: {
        height: 40,
    },
    tblBodyTxt: {
        textAlign: 'center'
    },
    tblBodyTxtActive: {
        textAlign: 'center',
        color: '#fc0341' // red
    }
});
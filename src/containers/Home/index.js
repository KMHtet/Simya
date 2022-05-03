import React from 'react';
import { View, StyleSheet, Text, FlatList, TextInput } from 'react-native';
import Table from 'react-native-simple-table'
import RawData from '../../assets/Input/leaderboard.json';
import { deviceWidth } from '../../themes/metrics';

const tableHeader = [
    {
        title: 'Name',
        dataIndex: 'name',
        width: deviceWidth * 0.35
    },
    {
        title: 'Rank',
        dataIndex: 'rank',
        width: deviceWidth * 0.1
    },
    {
        title: 'Number of bananas',
        dataIndex: 'bananas',
        width: deviceWidth * 0.2,
    },
    {
        title: 'isCurrentUser?',
        dataIndex: 'currentUser',
        width: deviceWidth * 0.23
    },
];

export default class Home extends React.PureComponent {

    constructor(props) {
        super(props);
        this.state = {
            sortedList: [],
            inputUser: 'x8RNvUgv5pZqDVatEXb2aYgSflq1',
        };
    }

    componentDidMount = () => {
    }

    renderItem = ({ item }) => (
        <View>
            <Text>{item.bananas} {item.uid} {item.name}</Text>
        </View>
    );

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
            const sortedList = rawDataList.sort(function (a, b) { return (b.bananas - a.bananas) });

            sortedList.map((i) => {
                i.rank = sortedList.indexOf(i) + 1;
                i.isCurrentUser = i.uid === currentUserObj.uid ? 'yes' : 'no';
                return i;
            });

            const indexOfCurrentUser = sortedList.indexOf(currentUserObj);
            if (indexOfCurrentUser >= 9) {
                sortedList.splice(9, 0, sortedList.splice(indexOfCurrentUser, 1)[0]);
            }

            this.setState({ sortedList: sortedList });
        } else {
            this.setState({ sortedList: [] });
        }
    }

    render() {
        const {
            sortedList,
            inputUser
        } = this.state;
        return (
            <View style={styles.container} >
                <TextInput
                    style={styles.input}
                    onChangeText={(text) => this.onChangeNumber(text)}
                    value={inputUser}
                    placeholder="Enter Current UserId"
                />
                {sortedList.length > 0 ? (
                    <Table height={320} columnWidth={60} columns={tableHeader} dataSource={sortedList} />
                    // <FlatList
                    //     data={sortedList}
                    //     extraData={this.state}
                    //     keyExtractor={(item, index) => index.toString()}
                    //     renderItem={this.renderItem}
                    // />
                ) : (
                    <View cls='flx-i aic jcc'>
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
        padding: 15
    },
    input: {
        height: 40,
        marginBottom: 10,
        borderWidth: 1,
        padding: 10,
    },
});
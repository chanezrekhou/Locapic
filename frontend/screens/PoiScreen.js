import React from 'react';
import { ScrollView, View } from 'react-native';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';

function PoiScreen(props) {
    var mySpots = props.mySpots ? props.mySpots : []
    var listItem = mySpots.map((element, i) => {
        return (<ListItem key={i} title={element.title} subtitle={element.description} />)
    }
    )
    return (
        <View style={{ flex: 1 }}>
            <ScrollView style={{ flex: 1, marginTop: 30 }}>
                {listItem}
            </ScrollView>
        </View>

    )
}

function mapStateToProps(state) {
    return { mySpots: state.mySpots }
}

export default connect(
    mapStateToProps,
    null
)(PoiScreen);


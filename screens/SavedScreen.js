import React from "react";
import { Text, StatusBar, StyleSheet, FlatList, Dimensions, ToastAndroid, ActivityIndicator, ImageBackground , TouchableOpacity , View } from "react-native";
import { Block } from "galio-framework";
import { Card, Colors, Title, ToggleButton, Paragraph, Button } from "react-native-paper";
import Firebase from "../firebase";
import Loader from './Loader'
const { width, height } = Dimensions.get("screen");
import Constants from 'expo-constants';
import { withNavigation } from "react-navigation";
import { SearchBar } from 'react-native-elements';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
let userid;



export default withNavigation(
  class SavedScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      SavedItem: [],
      loading: false,
      data: [],
  };
  this.arrayholder = [];
}



searchFilterFunction = text => {
  this.setState({
    value: text,
  });
  const newData = this.arrayholder.filter(item => {
  const itemData = `${item.DataArray.title.toUpperCase()}`;
  const textData = text.toUpperCase();
    return itemData.indexOf(textData) > -1;
  });
  this.setState({
    SavedItem: newData,
  });
};

renderHeader = () => {
  return (
    <SearchBar
      placeholder="Type Here..."
      
      round
      onChangeText={text => this.searchFilterFunction(text)}
      autoCorrect={false}
      value={this.state.value}
    />
  );
};



    openWebView = (uri) => {
    this.props.navigation.navigate('WebViewScreen', { uri: uri });
    console.log('uri working')
    console.log(uri);
  };

componentDidMount(){
  const { uid } = Firebase.auth().currentUser;
  userid= uid
  this.setState({
    loading: true
  });
  Firebase.database().ref('UsersList/' + uid).on('value', snapshot => {
    if(snapshot.val().savedlist === "new"){
      this.setState({ SavedItem: [] })
    }else{
      this.arrayholder = snapshot.val().savedlist;
      this.setState({ SavedItem: snapshot.val().savedlist })
    }
  
  })
  setTimeout(() => {
    this.setState({
      loading: false,
    });
  }, 2500);
}

savelist = (props) => {
  const arrayitem = this.state.SavedItem.filter(itm => itm.DataArray.id!==props.DataArray.id)
  Firebase.database().ref('UsersList/' + userid).update({
      savedlist: arrayitem,
  })
  ToastAndroid.showWithGravityAndOffset(
    'Removed from Saved List',
    ToastAndroid.SHORT,
    ToastAndroid.BOTTOM,
    25,
    50,
  )
}
ListEmpty = () => {
  return (
    //View to show when list is empty
    <View style={styles.MainContainer}>
      <Text style={{ textAlign: 'center' }}>No Data Found</Text>
    </View>
  );
};


renderItem = ({item}) => {
 
    return( 
     
      <Card style={styles.card}>
        <TouchableOpacity onPress={() => { this.openWebView(item.DataArray.url) }}>
        <Card.Cover source={{ uri: item.DataArray.images[0] }}  blurRadius={1}/>
        <Card.Content >
          <Title style={styles.titlecard}>{item.DataArray.title}</Title>
          <Paragraph style={styles.paracard}>{item.DataArray.description}</Paragraph>
        </Card.Content>
        <Card.Actions>
          <Button>#{item.DataArray.contentType}</Button>
          <ToggleButton
            style={styles.righticon}
            icon="heart"
            color={Colors.pink300}
            onPress={() => this.savelist(item)}
          ></ToggleButton>
</Card.Actions>
        </TouchableOpacity>
    </Card>
      
    )
}
  render() {
    return (
      
      <Block flex  style={{ backgroundColor: '#005957'}}>
        <StatusBar 
        translucent={true} 
        backgroundColor={'transparent'} />
        
         <Block center>
        <Loader loading={this.state.loading} />
        <Block middle style={styles.top}>
                  {/* <Text bold size={20} color="#fff">Saved Articles</Text> */}
        </Block>
       
        <FlatList
          data={this.state.SavedItem}
        //  keyExtractor={item => item.id.toString()}
          showsVerticalScrollIndicator={false}
          style={{ width: width * 0.9, height: height * 0.85}}
          ListEmptyComponent={this.ListEmpty}
        // onRefresh={() => }      
        renderItem={this.renderItem}  
        ListHeaderComponent={this.renderHeader}
        />
        </Block>
      </Block>
    )
  }
}
);

const styles = StyleSheet.create({
 fl: {
   
 },

  top: {
    marginBottom: 20 ,
    marginTop: Constants.statusBarHeight,
  }, 
   card: {
    margin: 10,

  },
  titlecard: {
    top:-130,
    fontSize: 22,
    color:'#fff',
    position:'absolute',
    fontWeight:"bold",
   // textShadowOffset:{width: -1,height: -1},
    lineHeight: 25,
    letterSpacing:1,
    // textShadowColor: "#808088",
    // textShadowRadius: 2,
    right:0,
    textShadowColor:'black',
    textShadowOffset:{width: 1, height: 1},
    textShadowRadius:20,
   
  },
  paracard: {
    paddingTop:10,
    lineHeight: 17,
    letterSpacing:0.7,
  },
  righticon: {
    right:10,
    position:"absolute"
  },
});
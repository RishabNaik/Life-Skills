import React from "react";
import { View, StyleSheet, Text, AsyncStorage, ScrollView, Dimensions } from "react-native";
import { Avatar, Button, Card, Title, Paragraph, IconButton ,Image, Colors, ToggleButton  } from 'react-native-paper';
import RNUrlPreview from 'react-native-url-preview';
const { width, height } = Dimensions.get("screen");
import data from "../../data"
//let arraynews = [];
const ary = []
const savedlist = []
export default class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    News: data,
    arraynews:null
  };
}





 async componentDidMount(){
  
      const myArray = await AsyncStorage.getItem('topickey');
      const arraynews = JSON.parse(myArray)
      
      const arraylist = arraynews.filter(element => {
          ary.push(element.selected?element.name:null)
      })
      this.setState({arraylist:ary})
}
     list = () => { 
     return this.state.News.map(element => {
        if(ary.indexOf(element.topic) !== -1){
          return (
            <Card  style={styles.card}>
            <Card.Title
              key={element.id}
              title={element.topic}
              titleStyle={styles.titlecard}
              right={(props) => 
                <ToggleButton
                    icon="heart"
                    //value={element.Saved}
                    color={Colors.pink300}
                    status={element.Saved}
                    onPress={ () => {  
                    if(element.Saved)
                    {
                            element.Saved=false
                            if(savedlist.indexOf(element.id) !== -1){
                            
                              var index = savedlist.indexOf(element.id);
                              if (index !== -1) savedlist.splice(index, 1);
                            // console.log(savedlist)
                  
                            } 
                    }
                    else{
                      element.Saved=true
                      if(savedlist.indexOf(element.id) !== -1){} 
                      else{
                          savedlist.push(element.id)
                         // console.log(savedlist)
                          }
                     }
                  
             //         console.log(savedlist)
                      AsyncStorage.setItem('save', JSON.stringify(savedlist));
                      
                   }
                  }
                  ></ToggleButton>
              }
              rightStyle={styles.righticon}
              style={styles.cardsty}
            />
          <RNUrlPreview  
            text={element.link} 
            titleStyle={styles.linktitle}
            containerStyle={styles.linkcontainer}
            titleNumberOfLines={2}
            imageStyle={styles.linkimage}
          />
          </Card>
          )
        }
    //    console.log(savedlist)
     });
    
  };

 
  render() {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
       // style={{ marginBottom:50 }}
      >
        
          {this.list()}
          {/* {this.list()} */}
      
      </ScrollView>
    )
  }
}
const styles = StyleSheet.create({
  container: {
      flex: 1,
  },
  card: {
    margin:10,
    paddingLeft:10,
    paddingRight:10
  },
  titlecard: {
    fontSize:12,
   
  },
  button: {
    elevation:0,
    borderRadius:100,
    color:"red"
  },
  righticon: {
    
  },
  cardsty: {
    marginTop: -16,
    marginBottom: -16,
    
  },
  linktitle: {
   // backgroundColor: '#fff'
   fontWeight:"bold",
   alignItems:"flex-start",
   
  },
  linkcontainer: {
    backgroundColor: '#fff',
    flex: 2, 
    flexDirection: 'row', 
    flexWrap: 'wrap'
  },
  // linkimage: {
  //   //alignItems: 'flex-end' ,
  //  // flexDirection: 'row',
  //  //  justifyContent: 'flex-start' ,
  // }

});

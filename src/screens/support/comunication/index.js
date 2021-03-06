import React from 'react';
import {
  View,
  FlatList,
  Text,
  Picker,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Dimensions,
  StyleSheet,
  Modal,
  Alert
} from 'react-native';
import Header from '../../../components/ui/header';
import HeaderAuthenticated from '../../../components/ui/header-authenticated';
import Icon from 'react-native-vector-icons/AntDesign';
import IconMaterial from 'react-native-vector-icons/MaterialCommunityIcons';
import IconFont from 'react-native-vector-icons/FontAwesome';
Icon.loadFont();
IconFont.loadFont();
IconMaterial.loadFont();

import api from '../../../config/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize
  } from "react-native-responsive-dimensions";


let { width, height } = Dimensions.get("window");
//let user

const init = async function (a, b) {
  user = JSON.parse(await AsyncStorage.getItem('@seculo/user'));
}
init();

const leiaMais = (string, limite) => {
  if(string.length > limite){
    return string.substring(0, limite).concat("...");
  }else{
    return string;
  }
}



class Comunication extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      itens: [
        { 
          ds_content: [] //COMUNICADO
        },
        {
          ds_content: [] //EVENTO
        },
        {
          ds_content: [] //OCORRÊNCIA
        }
      ],
      loading: true,
      select_option: 0,
      select_label: "COMUNICADOS",
      select_visible: false
    }
  }

  componentDidMount = () => {

   //console.log(" Responsavel: " + user.USU_LOGIN)
    api
      .post('notificacao/lstNotificacao-homologacao/', {
        p_cd_usuario: user.USU_LOGIN,
      })
      .then((res) => {

        //console.log("Comunicados: " + JSON.stringify(res.data))
        // console.log(res.data[1].NM_TIPO);
        //res.data.filter(i => console.log(i.ID_NOTIFICACAO, i.NM_TIPO));
        //console.log(res.data.filter(i => i.NM_TIPO == "COMUNICADO"));
        
        // if (res.data.length > 0) {
          
        //   this.setState({
        //     itens: res.data,
        //     loading: false
        //   })
          
        // } else {
        //   alert("Você não tem comunicados.");
        // }

        this.state.itens = [
          {
            id: 0,
            ds_title: "COMUNICADOS",
            ds_content: [...this.state.itens[0].ds_content, res.data.filter(i => i.NM_TIPO == "COMUNICADO")]
          },
          {
            id: 1,
            ds_title: "EVENTOS",
            ds_content: [...this.state.itens[1].ds_content, res.data.filter(i => i.NM_TIPO == "EVENTO")]
          },
          {
            id: 2,
            ds_title: "OCORRÊNCIAS",
            ds_content: [...this.state.itens[2].ds_content, res.data.filter(i => i.NM_TIPO == "OCORRÊNCIA")]
          }
        ]

        this.setState({
          ...this.state,
          loading: false
        })

      })
      .catch((err) => {
        alert("Erro ao carregar informações.");
      });
  };



  // componentDidUpdate = () => {
  //   api
  //   .post('notificacao/lstNotificacao-homologacao/', {
  //     p_cd_usuario: user.USU_LOGIN,
  //   })
  //   .then((res) => {

  //     let info = []
  //     info = [
  //       {
  //         id: 0,
  //         ds_title: "COMUNICADO",
  //         ds_content: [...this.state.itens[0].ds_content, res.data.filter(i => i.NM_TIPO == "COMUNICADO")]
  //       },
  //       {
  //         id: 1,
  //         ds_title: "EVENTO",
  //         ds_content: [...this.state.itens[1].ds_content, res.data.filter(i => i.NM_TIPO == "EVENTO")]
  //       },
  //       {
  //         id: 2,
  //         ds_title: "OCORRÊNCIA",
  //         ds_content: [...this.state.itens[2].ds_content, res.data.filter(i => i.NM_TIPO == "OCORRÊNCIA")]
  //       }
  //     ]


  //     // console.log(this.state.itens[this.state.select_option].ds_content);
  //     this.setState({
  //       itens: info,
  //       loading: false
  //     })

  //   })
  //   .catch((err) => {
  //     alert("Erro ao carregar informações.");
  //   });
  // }



  responderNotificacao(resposta, id){
    api
      .post('notificacao/confNotificacao/', {
        p_cd_usuario: user.USU_LOGIN,
        p_id_notificacao: id,
        p_status_confirmacao: resposta,
      })
      .then((res) => {
          console.log(JSON.stringify(res.data));
          alert("Resposta ao comunicado enviada.");
        
      })
      .catch((err) => {
      });
  }

  closeModal = () => {
    // this.setState({
    //   select_option: itemValue
    // })
    
    this.setState({
      select_visible: !this.state.select_visible 
    })
    
  }
  render() {
    return (
      <ScrollView nestedScrollEnabled={true} showsVerticalScrollIndicator={true}> 
        <View style={{ flex: 1, backgroundColor: '#F1F1F2', marginBottom:65}}>
          <Header navigation={this.props.navigation} />
          <HeaderAuthenticated />

         
          <View style={{backgroundColor:'transparent', marginTop:-2}}>
            <TouchableOpacity style={{justifyContent:'center', 
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  alignItems: 'center', 
                  marginVertical:20,
                  marginHorizontal:20, 
                  paddingVertical:10,
                  paddingHorizontal: 10,
                  paddingLeft:15,
                  borderRadius: 40,
                  borderWidth: 1,
                  borderColor: '#E8E8E8',
                  backgroundColor: '#FFFFFF'}} onPress={() => this.closeModal()}>
                <IconFont name="th-list" size={25} color="#E6BD56"/>
                <Text style={{
                textAlign: 'center',
                color: '#4674b7',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              {this.state.select_label} 
              </Text>
              <IconFont name="angle-down" size={25} />
            </TouchableOpacity>
          </View>
          
          <Modal 
            animationType="slide"
            transparent={true}
            visible={this.state.select_visible}
            onRequestClose={() => {
              Alert.alert("Modal fechada")
            }}>
            
            <View style={{flex:1}}>
              <View style={{backgroundColor:"#FFFFFF", width:'100%', height:'40%', position: 'absolute', bottom: 0}}>
                <TouchableOpacity style={{justifyContent:'center', alignItems: 'center', marginTop:50}} onPress={() => this.closeModal()}>
                    <Text style={{fontSize: responsiveFontSize(2), fontWeight: 'bold', justifyContent:'center', alignItems:'center'}}><Icon name="close" size={25}/> Fechar</Text>
                </TouchableOpacity>
                <Picker
                  selectedValue={this.state.select_label}
                  mode="dropdown"
                  style={{height: 50, width: '100%'}}
                  onValueChange={(itemValue, itemIndex) => this.setState({
                                                          select_option: itemIndex, 
                                                          select_label: itemValue,
                                                          select_visible: false
                                                          })}>
                  <Picker.Item label="COMUNICADOS" value="COMUNICADOS" />
                  <Picker.Item label="EVENTOS" value="EVENTOS" />
                  <Picker.Item label="OCORRÊNCIAS" value="OCORRÊNCIAS" />
                </Picker>
              </View>
            </View>

          </Modal>

          {/* {console.log("TITULO: "+this.state.itens[this.state.select_option].ds_title+"---------")} */}
          {/* {console.log("ID: "+this.state.itens[this.state.select_option].id+"---------")} */}


          {/* <View
            style={{
              marginVertical: 15,
            }}>
            <Text
              style={{
                textAlign: 'center',
                color: '#4674b7',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              COMUNICADOS 
            </Text>
          </View> */}
    

          <View style={{ paddingHorizontal: 20, marginBottom: 20 }} >
              {this.state.loading && <ActivityIndicator size="large" color="#4674B7" />}
              {/* {console.log(this.state.itens[0].ds_content[0])} */}
              {/**  itens[modificar o state conforme o selecionado] */}
              {/* {console.log(`modificado ${this.state.select_option}`)} */}


              <View
                scrollEnabled={true}
                scrollIndicatorInsets={true}>
                
                <FlatList
                    data={this.state.itens[this.state.select_option].ds_content[0]}
                    renderItem={(itemComunicado) =>
                    <TouchableOpacity 
                      key={itemComunicado.item.ID_NOTIFICACAO}
                      onPress={() => {this.props.navigation.navigate('DetailsComunication', {
                              titulo: itemComunicado.item.TITULO, 
                              conteudo: itemComunicado.item.MENSAGEM,
                              anexo: itemComunicado.item.ANEXO,
                              tipo_notificacao: itemComunicado.item.NM_TIPO,
                              flg_acao_atividade: itemComunicado.item.FLG_ACAO,
                              id_notificacao: itemComunicado.item.ID_NOTIFICACAO
                              })
                            }}>     
                      
                       <View style={[styles.box, itemComunicado.item.FLG_LIDO == 'S' ? styles.boxLido : styles.boxNaoLido]}>
                          <View style={{flex:2, flexDirection: 'row'}}>
                              <View style={{paddingRight: 30}}>
                                  <Text style={[styles.boxTitle]}> {itemComunicado.item.TITULO} </Text>
                                  
                              </View>
                              <Text style={{flex:1, alignSelf: "flex-end", position:'absolute', right: 0, top:0}}> 
                                {itemComunicado.item.FLG_LIDO == 'S' 
                                ? <IconMaterial name="star-outline" size={30}  style={[styles.btnTextYellow, styles.btnIconSmall]}/>
                                : <IconMaterial name="star" size={30}  style={[styles.btnTextYellow, styles.btnIconSmall]}/>}
                                
                                
                              </Text>
                                 
                              <View style={{flex:1.2}}>
                                  {itemComunicado.item.FLG_ACAO == 'CONCLUIDO' && <Text style={styles.btn}><Text style={[styles.btnText, styles.btnTextGreen]}>{itemComunicado.item.FLG_ACAO}</Text> <Icon name="check" size={25}  style={[styles.btnTextGreen, styles.btnIconSmall]}/></Text>}
                                  {itemComunicado.item.FLG_ACAO == 'FAZER' && <Text style={styles.btn}><Text style={[styles.btnText, styles.btnTextBlue]}>{itemComunicado.item.FLG_ACAO}</Text> <Icon name="exclamation" size={25}  style={[styles.btnTextBlue, styles.btnIconSmall]}/></Text>}
                                  {itemComunicado.item.FLG_ACAO == 'REFAZER' && <Text style={styles.btn}><Text style={[styles.btnText, styles.btnTextRed]}>{itemComunicado.item.FLG_ACAO}</Text> <Icon name="retweet" size={25}  style={[styles.btnTextRed, styles.btnIconSmall]}/></Text>}
                              </View>
                              
                          </View>
                          <View>
                            <Text style={[styles.boxContent, itemComunicado.item.FLG_LIDO == 'N' && styles.boxTextBold]}>{leiaMais(itemComunicado.item.MENSAGEM,100)}</Text>
                            <Text style={styles.contentDate}>
                                {itemComunicado.item.DT_NOTIFICAR} - {itemComunicado.item.HORARIO}
                            </Text>
                          </View>
                       </View>

                     
                    </TouchableOpacity>  
                    
                  }
                  keyExtractor={(item) => item.ID}
                />



              </View>

           
          </View>
        </View>
        </ScrollView>
    );
  }
}


const styles = StyleSheet.create({
  boxLido:{
    backgroundColor: '#FFFFFF',
  },
  boxNaoLido:{
    backgroundColor: '#E8E8E8',
  },
  boxTextBold:{
    fontWeight: 'bold'
  },
  box: {
      borderWidth: 1,
      borderColor: '#E8E8E8',
      padding: 20,
      borderRadius: 20,
      marginBottom: 10
  },
  boxTitle: {
      color: '#4674B7',
      fontWeight: 'bold',
      fontSize: responsiveFontSize(2)
  },
  boxTitleDisc: {
      color: '#5b5b5b',
      fontWeight: 'bold',
      fontSize: responsiveFontSize(1.8),
      marginVertical: 5
  },
  boxContent: { 
      marginVertical: 5,
      fontSize: responsiveFontSize(1.8),
      textAlign: 'left',
      textTransform: 'uppercase'
  },
  contentTitle: {
      textAlign: 'center', 
      fontSize:32, 
      color:'#111', 
      fontWeight:'bold'
  },
  contentDate: {
      textAlign: 'right', 
      fontWeight: 'bold', 
      color:'#6C6C6C' 
  },
  btn:{
      textAlign: 'right',
      
  },
  btnGreen:{
      borderColor: '#2d9500'
  },
  btnBlue:{
      borderColor: '#4674B7'
  },
  btnRed:{
      borderColor: '#cc0000'
  },
  btnText: {
      fontWeight: 'bold', 
      padding:8, 
      textAlign: 'right',
      fontSize: responsiveFontSize(1.8),
      justifyContent: 'center', 
      alignItems: 'center',
      flex:1
  },
  btnTextGreen: {
      color:'#2d9500', 
  },
  btnTextBlue: {
      color: '#4674B7'
  },
  btnTextYellow: {
    color: '#f1c232'
  },
  btnTextRed: {
      color: '#cc0000'
  },
  btnIconSmall: {
      justifyContent: 'center', 
      alignItems: 'center',
      flex:1,
      fontSize:responsiveFontSize(1.8)
  }
});


export default Comunication;


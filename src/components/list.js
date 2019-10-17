import React, { Component } from 'react'
import { Text, View, Image, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native'
import { listUserFunction } from '../services/function'
import  Editar  from './editar'
import  Crear  from './crear'

export default class list extends Component {

    static navigationOptions = ({navigation}) =>{

        const {params = {}} = navigation.state;
        return{
        headerTitle: (
            <View style={{flexDirection:'row',width:'100%'}}>
                <Text style={{ color: 'white', fontSize: 20, fontWeight: '400',textAlign: 'center',width:'100%' }}>Usuarios</Text>
            </View>
        ),
        headerTintColor: '#fff',
        headerStyle: {
            backgroundColor: 'black',
            shadowOpacity: 0,
            elevation: 0
        },
        headerTitleStyle: {
            color: 'white',
        },
        headerRight: 
            <View style={{flexDirection: 'row',height:'100%',justifyContent:'center' ,alignItems:'center'}}>
                <TouchableOpacity
                onPress={() =>{
                        params.cerrarModalCrear()
                    }}
                >
                        <View style={{paddingRight:20}}>
                        <Text style={{color:'white',fontSize:15}}>Agregar</Text>
                        </View> 
                </TouchableOpacity>
            </View>
        };
    }

    constructor(props) {
        super(props);
        this.state = {
            page: 1,
            responseListUser: {},
            paginado: [],
            active:null,
            editar: false,
            editarModal:{
                id:null,
                imagen:null,
                first:null,
                last:null,
                correo:null
            },
            crear:false
        }
    }

    async componentDidMount() {
        this.props.navigation.setParams({
            cerrarModalCrear:this.cerrarModalCrear
        })
        await this.listUser()
    }

    cerrarModalCrear = () => {
        this.setState({crear:true})
    }

    async listUser() {
        listUserFunction.listUserFunction(this.state.page).then(
            async (response) => {
                await this.setState({ responseListUser: response })
                await this.setState({ page: this.state.responseListUser.respondata.page })
                await this.paginado()
                console.log("Lista de Usuarios")
                console.log(this.state.responseListUser)
            }
        )
    }

    async paginado() {
        if (this.state.responseListUser.status == 0) {
            let newArray = []
            for (let index = 1; index <= this.state.responseListUser.respondata.total_pages; index++) {
                newArray.push({ posicion: index })
            }
            await this.setState({ paginado: newArray })
            await console.log(this.state.paginado)
        }
    }

    handlerLongClick = (id) => {
        
        Alert.alert(
            '¿Estás seguro que deseas eliminar ?',
            'Se eliminara de manera permanente.', [{
                text: 'Cancelar',
                onPress: () => console.log('Cancel Pressed'),
                style: 'cancel'
            }, {
                text: 'Aceptar',
                onPress: () => this.eliminarUser(id)
            }, ], {
                cancelable: false
            }
         )
         
    }

    eliminarUser = (id) => {
        console.warn('ID a eliminar')
        console.warn(id)
        listUserFunction.deleteUser(id).then(
            async (response) => {
                console.warn('Segun el servicio https://reqres.in/ debe retornar como caido')
                await console.warn(response)
            }
        )
    }

    renderUser() {
        if (this.state.responseListUser.status == 0) {
            return (
                <View style={{ flex: 1, width: '100%', height: '100%' }}>
                    <View style={{ paddingHorizontal: 16, width: '100%' }}>
                        <View style={{ flexDirection: 'row', marginTop: 0, marginBottom: 10 }}>
                            <Text style={{ flex: 5, textAlign: 'left', paddingLeft: 16 }}>Total de usuarios : {this.state.responseListUser.respondata.total}</Text>
                            <Text style={{ flex: 5, textAlign: 'right', paddingRight: 16 }}>Pagina : {this.state.responseListUser.respondata.page}</Text>
                        </View>

                        <View style={{justifyContent:'center',width:'100%',alignItems:'center'}}>
                            {
                                this.state.responseListUser.respondata.data.map((element, indice) => {
                                    return (
                                        <TouchableOpacity
                                            onPress={async () => {
                                                await this.setState({active:indice+1})
                                                await this.setState({editarModal:{
                                                    id:element.id,
                                                    imagen:element.avatar,
                                                    first:element.first_name,
                                                    last:element.last_name,
                                                    correo:element.email
                                                }})
                                                await this.setState({editar:true})
                                                // console.log(this.state.editarModal)
                                            }}
                                            onLongPress={()=>{

                                                Alert.alert(
                                                    '¿Estás seguro que deseas eliminar ?',
                                                    'Se eliminara de manera permanente.', [{
                                                        text: 'Cancelar',
                                                        onPress: () => console.log('Cancel Pressed'),
                                                        style: 'cancel'
                                                    }, {
                                                        text: 'Aceptar',
                                                        onPress: () => this.eliminarUser(element.id)
                                                    }, ], {
                                                        cancelable: false
                                                    }
                                                 )

                                            }}
                                            key={indice}
                                        >

                                            <View style={{ width: this.state.active == element.id ? '90%': '100%' ,backgroundColor: this.state.active == element.id ? '#dddddd': 'white'  , marginVertical: 10, borderWidth: 1, borderColor: '#dddddd', borderRadius: 5, paddingHorizontal: 16, paddingVertical: 10, flexDirection: 'row' }} key={indice}>
                                                <Image
                                                    source={{ uri: element.avatar }}
                                                    style={{ width: 100, height: 100, borderRadius: 50, flex: 3, resizeMode: 'contain' }}
                                                    onError={(e) => {
                                                        console.warn("Error cargar imagen" + JSON.stringify(e.nativeEvent.error))
                                                    }}
                                                />
                                                <View style={{ flex: 7, paddingLeft: 16, alignSelf: 'center' }}>
                                                    <Text style={{ fontWeight: 'bold', color: '#2A2A3C', fontSize: 20 }} >{element.first_name} {element.last_name} </Text>
                                                    <Text style={{ color: '#86888C', fontSize: 16 }}>{element.email}</Text>
                                                </View>
                                            </View>
                                        
                                        </TouchableOpacity>
                                    )
                                })
                            }       
                        </View>
                    </View>

                    <View style={{ width: '100%', height: 50, bottom: 0, marginTop: 10, justifyContent: 'center', flexDirection: 'row', alignItems: 'center' }}>
                        {
                            this.state.paginado.map((element, indice) => {
                                return (
                                    <TouchableOpacity
                                        onPress={async () => {
                                            await this.setState({ page: indice + 1 })
                                            await this.listUser()
                                        }}
                                        key={indice}
                                    >
                                        <View style={{ width: this.state.page == indice + 1 ? 40 : 30, height: this.state.page == indice + 1 ? 40 : 30, backgroundColor: this.state.page == indice + 1 ? '#dddddd' : 'white', borderRadius: 5, borderWidth: 1, borderColor: '#dddddd', alignSelf: 'center', justifyContent: 'center', marginHorizontal: 5 }} key={indice}>
                                            <Text style={{ textAlign: 'center' }}>{element.posicion}</Text>
                                        </View>
                                    </TouchableOpacity>
                                )
                            })
                        }
                    </View>
                </View>
            )
        } else {

        }

    }

    modalEdit() {
        return (
            <Modal
                visible={this.state.editar}
                animationType='fade'
                transparent={true}
            >
                <View 
                    style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.5)' }}
                >
                    <Editar 
                        id = {this.state.editarModal.id}
                        foto = {this.state.editarModal.imagen}
                        nombre = {this.state.editarModal.first}
                        apellido = {this.state.editarModal.last}
                        correo = {this.state.editarModal.correo}
                        cerrarModal   = { async (valor) => {
                            await this.setState({editar:valor,active:null})
                            
                        }}
                    />
                </View>

            </Modal>
        )
    }

    modalCrear(){
        return(
        <Modal
            visible={this.state.crear}
            animationType='fade'
            transparent={true}
        >
            <View 
                style={{ width: '100%', height: '100%', justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,.5)' }}
            >
                <Crear
                cerrarModal   = { async (valor) => {
                    await this.setState({crear:valor})
                }}
                  />
            </View>
        </Modal> 
        )
    }


    render() {
        return (
            <ScrollView style={{ flex: 1, width: '100%', height: '100%', backgroundColor: 'white' }} contentContainerStyle={{ paddingTop: 20, paddingBottom: 20 }}>

                {this.modalEdit()}
                {this.modalCrear()}
                {this.renderUser()}
            </ScrollView>
        )
    }
}

import React, { Component } from 'react'
import { Text, View, TouchableOpacity, Image, ActivityIndicator } from 'react-native'
import {TextField}  from 'react-native-material-textfield'
import { listUserFunction } from '../services/function'

export default class editar extends Component {

    constructor(props) {
        super(props);
        this.state = {
                id:'',
                imagen:'',
                first:'',
                last:'',
                correo:'',
                cargando:true,
                correotrue:true,
                posicionNombre:0,
                posicionApellido:0,
                posicionCorreo:0,
                errorNombre:["","Ingresa nombre","El nombre debe tener mas de 2 digitos"],
                errorApellido:["","Ingresa apellido","El apellido debe tener mas de 2 digitos"],
                errorCorreo:["","Ingresa correo","Correo electronico invalido"],
                cargandoEditar:false,
                responseEditar:{}
        }
    }

    async componentDidMount(){

        await this.setState({
            id:this.props.id,
            imagen:this.props.foto,
            first:this.props.nombre,
            last:this.props.apellido,
            correo:this.props.correo
        })

        await this.setState({cargando:false})

    }
    render() {
        
            return (
                <View style={{ backgroundColor: 'white', width: 250, borderRadius: 5 }}>

                    <View style={{ width: '100%', height: 40, backgroundColor: 'black', flexDirection: 'row' }}>
                        <View style={{ height: '100%', width: 215, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white',marginRight:-35 }}>{this.props.nombre} {this.props.apellido}</Text>
                        </View>
                        <TouchableOpacity
                        onPress={ async () => {
                            await this.props.cerrarModal(false)
                        }}
                        >
                        
                            <View style={{ height: '100%', width: 35, justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ color: 'white' }}>X</Text>
                            </View>
                        </TouchableOpacity>
                    </View>

                    <View style={{paddingVertical:20,paddingHorizontal:16,width:'100%',justifyContent:'center',alignItems:'center'}}>
                        <Image
                            source={{ uri: this.props.foto }}
                            style={{ width: 100, height: 100, borderRadius: 50, resizeMode: 'contain' ,marginBottom:16}}
                            onError={(e) => {
                                console.warn("Error cargar imagen" + JSON.stringify(e.nativeEvent.error))
                            }}
                        />
                        <View style={{width:'100%'}}>
                            {!this.state.cargando ? <TextField
                                    labelHeight={16}
                                    tintColor={'#000000'}
                                    label={"Nombre"}
                                    value={this.state.first}
                                    returnKeyType={"done"}
                                    onChangeText= { async(text)=>{
                                        await this.setState({first:text.replace(/[^A-Za-z]/g, '')})

                                        if(this.state.first.length==0){
                                            await this.setState({posicionNombre:1})
                                        }else if(this.state.first.length<3){
                                            await this.setState({posicionNombre:2})
                                        }else{
                                            await this.setState({posicionNombre:0})
                                        }

                                    }}
                                    
                            />:null}

                                <Text style={{fontSize:10,color:'red'}}>{this.state.errorNombre[this.state.posicionNombre]}</Text>
                            
                        </View>
                        <View style={{width:'100%',marginTop:10}}>
                            {!this.state.cargando ? <TextField
                                    labelHeight={16}
                                    tintColor={'#000000'}
                                    label={"Apellido"}
                                    value={this.state.last}
                                    returnKeyType={"done"}
                                    onChangeText= { async(text)=>{
                                        await this.setState({last:text.replace(/[^A-Za-z]/g, '')})

                                        if(this.state.last.length==0){
                                            await this.setState({posicionApellido:1})
                                        }else if(this.state.last.length<3){
                                            await this.setState({posicionApellido:2})
                                        }else{
                                            await this.setState({posicionApellido:0})
                                        }
                                    }}
                                    
                            />:null}
                            
                                <Text style={{fontSize:10,color:'red'}}>{this.state.errorApellido[this.state.posicionApellido]}</Text>
                            
                        </View>
                        <View style={{width:'100%',marginTop:10}}>
                            {!this.state.cargando ? <TextField
                                    labelHeight={16}
                                    tintColor={'#000000'}
                                    label={"Correo"}
                                    value={this.state.correo}
                                    returnKeyType={"done"}
                                    onChangeText= { async(text)=>{
                                        let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,10})+$/ ;
                                        if(text.length==0){
                                            await this.setState({posicionCorreo:1})
                                        }else if(reg.test(text) === false){
                                            await this.setState({correo:text,correotrue:false,posicionCorreo:2})
                                            return false;
                                        }else {
                                            await this.setState({correo:text,correotrue:true,posicionCorreo:0})
                                        }
                                    }}

                            />:null}

                                <Text style={{fontSize:10,color:'red'}}>{this.state.errorCorreo[this.state.posicionCorreo]}</Text>
                        </View>
                        

                        <View style={{width:'100%',height:40,marginTop:30}}>
                                <TouchableOpacity
                                
                                onPress={async () => {

                                    if(this.state.posicionNombre!=0 || this.state.posicionApellido!=0 || this.state.posicionCorreo!=0 || !this.state.correotrue){
                                        console.log("Falta completar campos")
                                        return false
                                    }else{

                                        await this.setState({cargandoEditar:true})

                                        let data = {
                                            first_name:this.state.first,
                                            last_name:this.state.last,
                                            email:this.state.correo,
                                            avatar:this.state.imagen
                                        }

                                        listUserFunction.updateUser(this.state.id,data).then(
                                            async (response) => {
                                                await console.log(response)
                                                await this.setState({cargandoEditar:false})
                                                await this.setState({responseEditar:response})
                                            }
                                        )

                                    }

                                   
                                }}
                                >   
                                    

                                    <View style={{height:40,width:'100%',backgroundColor:'rgba(0,0,0,1)',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                                        {
                                            this.state.cargandoEditar ?
                                                <ActivityIndicator
                                                    color={'white'}
                                                    size={'large'}
                                                />
                                            :
                                                <Text style={{color:'white',fontSize:16,textAlign:'center'}}>
                                                    EDITAR
                                                </Text>

                                        }
                                        
                                    </View>

                                    
                                </TouchableOpacity>
                        </View>
                        <View style={{marginTop:10,textAlign:'left'}}>
                            <Text style={{fontSize:10,textAlign:'left',fontWeight:'bold'}}>Reponse del servicio</Text>
                            <Text style={{fontSize:10,textAlign:'left'}}>{JSON.stringify(this.state.responseEditar)}</Text>
                        </View>
                    </View>
                </View>
            )   
        
    }
}

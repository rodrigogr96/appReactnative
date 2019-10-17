import React, { Component } from 'react'
import { Text, View, TouchableOpacity, ActivityIndicator } from 'react-native'
import {TextField}  from 'react-native-material-textfield'
import { listUserFunction } from '../services/function'

export default class crear extends Component {

    constructor(props) {
        super(props);
        this.state = {
                id:'',
                imagen:'',
                first:'',
                last:'',
                correo:'',
                correotrue:false,
                posicionNombre:0,
                posicionApellido:0,
                posicionCorreo:0,
                errorNombre:["","Ingresa nombre","El nombre debe tener mas de 2 digitos"],
                errorApellido:["","Ingresa apellido","El apellido debe tener mas de 2 digitos"],
                errorCorreo:["","Ingresa correo","Correo electronico invalido"],
                responseCrear:{},
                cargandoCrear:false,
        }
    }

    async componentDidMount(){}

    render() {
        
            return (
                <View style={{ backgroundColor: 'white', width: 250, borderRadius: 5 }}>

                    <View style={{ width: '100%', height: 40, backgroundColor: 'black', flexDirection: 'row' }}>
                        <View style={{ height: '100%', width: 215, justifyContent: 'center', alignItems: 'center' }}>
                            <Text style={{ color: 'white',marginRight:-35 }}>Crear usuario</Text>
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
                        <View style={{width:'100%'}}>
                            <TextField
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
                                    
                            />

                                <Text style={{fontSize:10,color:'red'}}>{this.state.errorNombre[this.state.posicionNombre]}</Text>
                            
                        </View>
                        <View style={{width:'100%',marginTop:10}}>
                            <TextField
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
                                    
                            />
                            
                                <Text style={{fontSize:10,color:'red'}}>{this.state.errorApellido[this.state.posicionApellido]}</Text>
                            
                        </View>
                        <View style={{width:'100%',marginTop:10}}>
                            <TextField
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

                            />

                                <Text style={{fontSize:10,color:'red'}}>{this.state.errorCorreo[this.state.posicionCorreo]}</Text>
                        </View>

                        <View style={{width:'100%',height:40,marginTop:30}}>
                                <TouchableOpacity
                                onPress={async () => {

                                    if(this.state.posicionNombre!=0 || this.state.posicionApellido!=0 || this.state.posicionCorreo!=0 || !this.state.correotrue){
                                        console.log("Falta completar campos")
                                        return false
                                    }else{

                                        await this.setState({cargandoCrear:true})

                                        let data = {
                                            first_name:this.state.first,
                                            last_name:this.state.last,
                                            email:this.state.correo
                                        }

                                        listUserFunction.createUser(data).then(
                                            async (response) => {
                                                await console.log(response)
                                                await this.setState({cargandoCrear:false})
                                                await this.setState({responseCrear:response})
                                            }
                                        )

                                    }

                                   
                                }}
                                >
                                    <View style={{height:40,width:'100%',backgroundColor:'rgba(0,0,0,1)',borderRadius:5,justifyContent:'center',alignItems:'center'}}>
                                        {
                                            this.state.cargandoCrear ?
                                                <ActivityIndicator
                                                    color={'white'}
                                                    size={'large'}
                                                />
                                            :
                                                <Text style={{color:'white',fontSize:16,textAlign:'center'}}>
                                                    CREAR
                                                </Text>

                                        }
                                    </View>
                                </TouchableOpacity>
                        </View>

                        <View style={{marginTop:10,textAlign:'left'}}>
                            <Text style={{fontSize:10,textAlign:'left',fontWeight:'bold'}}>Reponse del servicio</Text>
                            <Text style={{fontSize:10,textAlign:'left'}}>{JSON.stringify(this.state.responseCrear)}</Text>
                        </View>

                    </View>
                </View>
            )   
        
    }
}

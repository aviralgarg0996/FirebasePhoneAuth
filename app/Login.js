import React, { Component } from 'react';
import { View, Button, Text, TextInput, Image, ImageBackground,TouchableOpacity } from 'react-native';

import firebase from 'react-native-firebase';
import background from "./images/back.png";
import logo from "./images/slidelogo.png"
const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.unsubscribe = null;
    this.state = {
      user: null,
      message: '',
      codeInput: '',
      phoneNumber: '',
      confirmResult: null,
    };
  }

  componentDidMount() {
    this.unsubscribe = firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ user: user.toJSON() });
      } else {
        // User has been signed out, reset the state
        this.setState({
          user: null,
          message: '',
          codeInput: '',
          phoneNumber: '',
          confirmResult: null,
        });
      }
    });
  }

  componentWillUnmount() {
     if (this.unsubscribe) this.unsubscribe();
  }

  signIn = () => {
    const { phoneNumber } = this.state;    
    if(phoneNumber=="")
    this.setState({ message: 'Enter Phone Number ...' });
    else if(phoneNumber.length!=10)
    this.setState({ message: 'Enter Valid Phone Number ...' });
    
    else
    {
    this.setState({ message: 'Sending code ...' });

    firebase.auth().signInWithPhoneNumber(`+91${phoneNumber}`)
      .then(confirmResult => {
        this.setState({ confirmResult })
        console.log("confirmResult",confirmResult)
      })
      .catch(error => this.setState({ message: `Sign In With Phone Number Error: ${error.message}` }));
 
   }   };

  confirmCode = () => {
    const { codeInput, confirmResult } = this.state;

    if (confirmResult && codeInput.length) {
      confirmResult.confirm(codeInput)
        .then((user) => {
          this.setState({ message: 'Code Confirmed!' });
        })
        .catch(error => this.setState({ message: `Code Confirm Error: ${error.message}` }));
    }
  };

  signOut = () => {
    firebase.auth().signOut();
  }

  renderPhoneNumberInput() {
   const { phoneNumber } = this.state;

    return (
      <View style={{ padding: 25 }}>
        <Text style={{color:'white',fontSize:20}}>Enter Your Contact Number:</Text>
        <TextInput
         keyboardType='numeric'
          style={{ height: 40, marginTop: 15, marginBottom: 15 ,color:'white',borderColor:'#1a1a1a',borderWidth:1,borderRadius:6}}
          onChangeText={value => this.setState({ phoneNumber: value })}
          placeholder={'Contact number ... '}
          placeholderTextColor="white" 
          value={phoneNumber}
          maxLength={10}
        />
        <Button title="Sign In" color="green" onPress={this.signIn} />
        
      </View>
    );
  }

  renderMessage() {
    const { message } = this.state;

    if (!message.length) return null;
    return (
      <Text style={{ padding: 5, color: '#fff' }}>{message}</Text>
    );
  }

  renderVerificationCodeInput() {
    const { codeInput } = this.state;

    return (
      <View style={{ marginTop: 25, padding: 25 }}>
        <Text style={{color:'white',fontSize:20}}>Enter verification code below:</Text>
        <TextInput
         keyboardType='numeric'
          style={{ height: 40, marginTop: 15, marginBottom: 15 ,color:'white',borderColor:'#1a1a1a',borderWidth:1,borderRadius:6}}
          onChangeText={value => this.setState({ codeInput: value })}
          placeholder={'Verify Code ... '}
          placeholderTextColor="white" 
          value={codeInput}
         
        />
        {()=>this.setState({ message: `CodeResult: ${this.state.confirmResult}` })}
        {/* {this.state.confirmResult} */}
        <Button title="Confirm Code" color="#841584" onPress={this.confirmCode} />
      </View>
    );
  }
// verifyNumberWitHFirebase=()=>{
//     firebase.auth()
//     .verifyPhoneNumber("+918384849570")
//     .on('state_changed', (phoneAuthSnapshot) => {
//       // How you handle these state events is entirely up to your ui flow and whether
//       // you need to support both ios and android. In short: not all of them need to
//       // be handled - it's entirely up to you, your ui and supported platforms.
  
//       // E.g you could handle android specific events only here, and let the rest fall back
//       // to the optionalErrorCb or optionalCompleteCb functions
//       switch (phoneAuthSnapshot.state) {
//         // ------------------------
//         //  IOS AND ANDROID EVENTS
//         // ------------------------
//         case firebase.auth.PhoneAuthState.CODE_SENT: // or 'sent'
//          alert('code sent');
//           // on ios this is the final phone auth state event you'd receive
//           // so you'd then ask for user input of the code and build a credential from it
//           // as demonstrated in the `signInWithPhoneNumber` example above
//           break;
//         case firebase.auth.PhoneAuthState.ERROR: // or 'error'
//          alert('verification error');
//          alert(phoneAuthSnapshot.error);
//           break;
  
//         // ---------------------
//         // ANDROID ONLY EVENTS
//         // ---------------------
//         case firebase.auth.PhoneAuthState.AUTO_VERIFY_TIMEOUT: // or 'timeout'
//          alert('auto verify on android timed out');
//           // proceed with your manual code input flow, same as you would do in
//           // CODE_SENT if you were on IOS
//           break;
//         case firebase.auth.PhoneAuthState.AUTO_VERIFIED: // or 'verified'
//           // auto verified means the code has also been automatically confirmed as correct/received
//           // phoneAuthSnapshot.code will contain the auto verified sms code - no need to ask the user for input.
//          alert('auto verified on android');
//          alert(phoneAuthSnapshot);
//           // Example usage if handling here and not in optionalCompleteCb:
//           // const { verificationId, code } = phoneAuthSnapshot;
//           // const credential = firebase.auth.PhoneAuthProvider.credential(verificationId, code);
  
//           // Do something with your new credential, e.g.:
//           // firebase.auth().signInWithCredential(credential);
//           // firebase.auth().currentUser.linkWithCredential(credential);
//           // etc ...
//           break;
//       }
//     }, (error) => {
//       // optionalErrorCb would be same logic as the ERROR case above,  if you've already handed
//       // the ERROR case in the above observer then there's no need to handle it here
//      alert(error);
//       // verificationId is attached to error if required
//      alert(error.verificationId);
//     }, (phoneAuthSnapshot) => {
//       // optionalCompleteCb would be same logic as the AUTO_VERIFIED/CODE_SENT switch cases above
//       // depending on the platform. If you've already handled those cases in the observer then
//       // there's absolutely no need to handle it here.
  
//       // Platform specific logic:
//       // - if this is on IOS then phoneAuthSnapshot.code will always be null
//       // - if ANDROID auto verified the sms code then phoneAuthSnapshot.code will contain the verified sms code
//       //   and there'd be no need to ask for user input of the code - proceed to credential creating logic
//       // - if ANDROID auto verify timed out then phoneAuthSnapshot.code would be null, just like ios, you'd
//       //   continue with user input logic.
//       console.log(phoneAuthSnapshot);
//     });
  
// }
  render() {
    const { user, confirmResult } = this.state;
    return (
        <ImageBackground source={background} style={{width:"100%",height:"100%",justifyContent:'center',alignItems:'center'}}>
        <Image
          style={{width: 300, height: 170}}
          source={logo}
        />
        {!user && !confirmResult && this.renderPhoneNumberInput()}

        {this.renderMessage()}

        {!user && confirmResult && this.renderVerificationCodeInput()}

        {user && (
          <View
            style={{
              padding: 15,
              justifyContent: 'center',
              alignItems: 'center',
              flex: 1,
            }}
          >
            {()=>this.setState({message:""})}
            {/* <Text>{JSON.stringify(user)}</Text> */}
            <TouchableOpacity style={{backgroundColor:'red',padding:15,borderRadius:4}}  onPress={this.signOut}><Text style={{ fontSize: 25 ,color:'white'}}>Sign Out</Text></TouchableOpacity>
          </View>
        )}
         </ImageBackground>
    );
  }
}
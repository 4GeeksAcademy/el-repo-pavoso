const backendUrl=process.env.BACKEND_URL

const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
      accessToken:null
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
      signUpUser:async (email,password)=>{
        const resp= await fetch(backendUrl + "/signup",{
          method:"POST",
          headers:{
            "Content-Type":"application/json"
          },
          body:JSON.stringify({email,password})
        })
        if(!resp.ok){
          console.log("Error: " + resp.status)
          return false
        }
        return true
      },
      loginUser:async (email,password)=>{
        const resp= await fetch(backendUrl + "/login",{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
            "Access-Controll-Allow-Origin":"*"
          },
          body:JSON.stringify({email,password})
        })
        if(!resp.ok){
          console.log("Error: " + resp.status)
          return false
        }
        let data=await resp.json()
        setStore({accessToken:data.token})
        localStorage.setItem("accessToken",data.token)
        return true
      },
      loadSession:async()=>{
        setStore({accessToken:localStorage.getItem("accessToken")})
      },
      apiFetchPrivate:async (endpoint,method="GET",body=null)=>{
        let {accessToken}=getStore()
        let fetchParams={
          method,
          headers:{
            "Access-Controll-Allow-Origin":"*",
            "Authorization": "Bearer " + accessToken
          }
        }
        if(body){
          fetchParams.body=JSON.stringify(body)
          fetchParams.headers["Content-Type"]="application/json"
        }
        try {
          let resp=await fetch(backendUrl+endpoint,fetchParams)
          if(!resp.ok){
            console.log(resp.statusText)
            return null
          }
          let data=await resp.json()
          return data          
        } catch (error) {
          console.error(error)
          return null
        }
      },      
      logoutUser:async ()=>{
        let actions=getActions()
        let resp=await actions.apiFetchPrivate("/logout","POST")
        if(!resp){
          console.log("No se pudo cerrar sesion")
          return false
        }
        localStorage.removeItem("accessToken")
        setStore({accessToken:null})
        console.log("Sesion cerrada")
        return true
      },
      userInfo:async()=>{
        let actions=getActions()
        let resp=await actions.apiFetchPrivate("/userupdate","PUT",{name:"Arnaldo"})
        if(!resp){
          console.log("No se pudo obtener la informacion del usuario")
          return false
        }
        setStore({userInfo:resp})
        return true
      }
		}
	};
};

export default getState;

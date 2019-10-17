const listUserFunction =  {
    listUserFunction: async (page) => {
        try {
            let response = await fetch(`https://reqres.in/api/users?page=${page}`, {
                method: 'GET'
            })
            let responseJson = await response.json()
            return {status:0,respondata:responseJson}

        } catch (error) {
            return {status:1,respondata:[]}
        }
    },
    updateUser: async (id,data) => {
        try {
            let response = await fetch(`https://reqres.in/api/users/${id}`, {
                method: 'PUT',
                headers:{
                    "Accept": 'application/json',
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(data)
            })
            let responseJson = await response.json()
            return {status:0,respondata:responseJson}

        } catch (error) {
            return {status:1,respondata:[]}
        }
    },
    createUser: async (data) => {
        try {
            let response = await fetch(`https://reqres.in/api/users`, {
                method: 'POST',
                headers:{
                    "Accept": 'application/json',
                    "Content-Type": 'application/json',
                },
                body: JSON.stringify(data)
            })
            let responseJson = await response.json()
            return {status:0,respondata:responseJson}

        } catch (error) {
            return {status:1,respondata:[]}
        }
    },
    deleteUser: async (id) => {
        try {
            let response = await fetch(`https://reqres.in/api/users/${id}`, {
                method: 'DELETE'
            })
            let responseJson = await response.json()
            return {status:0,respondata:responseJson}

        } catch (error) {
            return {status:1,respondata:[]}
        }
    },

}

export {listUserFunction}
/* eslint-disable @typescript-eslint/no-explicit-any */
 
import axios from 'axios'
import https from 'https'

export let getProductResponse: any
export class GetProductApi {
  public async toGetProdcuts(): Promise<number> {
    try {
      const config = {
        method: 'get',
        url: 'https://fakestoreapi.com/products',
        // headers: {
        //   Authorization: '',
        // },
        httpsAgent: new https.Agent({
          // for self signed you could also add
          rejectUnauthorized: false,
        }),
      }
      const response = await axios(config)
      getProductResponse = await response
      console.log(
        `Get Product Response=====>`,
        JSON.stringify(getProductResponse.data)
      )
      return response.status
    } catch (error) {
      if (error.response) {
        console.error('Error Response:', error.response.data)
        console.error('Error Status Code:', error.response.status)
        return error.response.status // Return status code for error response
      } else {
        console.error('Error:', error.message)
        throw error // Rethrow if it's not an error from the server
      }
    }
  }

  public  async getListOfIds(){
    const id =  await getProductResponse?.data.map(product=>product.id)
    return id
 }
}

import axios, {
	AxiosRequestConfig,
	AxiosResponse,
	RawAxiosRequestHeaders,
} from "axios";

export default class Api {
	private static _instance: Api | null = null;

	private _basePath: string;

	private _authorization: string | null;

	public set authorization(value: string | null) {
		this._authorization = value;
	}

	private constructor(basePath: string, authorization: string | null) {
		this._basePath = basePath;
		this._authorization = authorization;
	}

	public static async getInstance() {
		if (!this._instance) {
			//const basePath = `http://${import.meta.env.VITE_API_BASE_PATH}:8080`;
			const basePath = import.meta.env.VITE_API_BASE_PATH || "";
			this._instance = new Api(basePath, null);
		}	

		return this._instance;
	}

	public async request<RequestType, ResponseType>(config: AxiosRequestConfig) {
		const headers: RawAxiosRequestHeaders = {
			Authorization: this._authorization ? `Bearer ${this._authorization}` : "",
		};

		// Solo establecer Content-Type si no es FormData
		if (!(config.data instanceof FormData)) {
			headers["Content-Type"] = "application/json";
		}

		const configOptions: AxiosRequestConfig = {
			...config,
			baseURL: this._basePath,  // ← aquí basePath puede ser "" o "/"
			headers: headers,
		};

		console.log("[API REQUEST]", {
			url: configOptions.url,
			method: configOptions.method,
			baseURL: configOptions.baseURL,
			headers: configOptions.headers,
			params: configOptions.params,
			data: configOptions.data,
		});

		try {
			const response = await axios.request<RequestType, AxiosResponse<ResponseType>>(configOptions);
			console.log("[API RESPONSE]", {
				url: configOptions.url,
				status: response.status,
				data: response.data,
				headers: response.headers,
			});
			return response;
		} catch (error) {
			console.error("[API ERROR]", error);
			throw error;
		}
	}

	public get<RequestType, ResponseType>(config: AxiosRequestConfig) {
		//const configOptions: AxiosRequestConfig = {
		return this.request<RequestType, ResponseType>({
			...config,
			method: "GET",
		//};

		//return this.request<RequestType, ResponseType>(configOptions);
		});
	}

	public post<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		//const configOptions: AxiosRequestConfig = {
		return this.request<RequestBodyType, ResponseBodyType>({
			...options,
			method: "POST",
			data,
		//};

		//return this.request<RequestBodyType, ResponseBodyType>(configOptions);
		});
	}

	public delete(options: AxiosRequestConfig) {
		//const configOptions: AxiosRequestConfig = {
		return this.request<void, void>({
			...options,
			method: "DELETE",
		//};

		//return this.request<void, void>(configOptions);
		});
	}

	public put<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		//const configOptions: AxiosRequestConfig = {
		return this.request<RequestBodyType, ResponseBodyType>({
			...options,
			method: "PUT",
			data: data,
		//};

		//return this.request<RequestBodyType, ResponseBodyType>(configOptions);
		});
	}

	public patch<RequestBodyType, ResponseBodyType>(
		data: RequestBodyType,
		options: AxiosRequestConfig,
	) {
		//const configOptions: AxiosRequestConfig = {
	    return this.request<RequestBodyType, ResponseBodyType>({
			...options,
			method: "PATCH",
			data: data,
		//};

		//return this.request<RequestBodyType, ResponseBodyType>(configOptions);
		});
	}
}

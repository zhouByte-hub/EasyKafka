// HTTP 请求工具 - 已移除所有HTTP请求代码

// 模拟数据响应
const mockResponse = (data: any, code = 200, message = 'success') => {
  return {
    code,
    message,
    data
  }
}

// 创建 HTTP 实例
class Http {
  constructor() {
    // 构造函数
  }

  // 通用请求方法
  async request<T = any>(config: any): Promise<T> {
    return mockResponse({}) as unknown as T
  }

  // GET 请求
  async get<T = any>(url: string, config?: any): Promise<T> {
    return mockResponse({}) as unknown as T
  }

  // POST 请求
  async post<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return mockResponse({}) as unknown as T
  }

  // PUT 请求
  async put<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return mockResponse({}) as unknown as T
  }

  // DELETE 请求
  async delete<T = any>(url: string, config?: any): Promise<T> {
    return mockResponse({}) as unknown as T
  }

  // PATCH 请求
  async patch<T = any>(url: string, data?: any, config?: any): Promise<T> {
    return mockResponse({}) as unknown as T
  }

  // 上传文件
  async upload<T = any>(url: string, file: File, config?: any): Promise<T> {
    return mockResponse({}) as unknown as T
  }

  // 下载文件
  async download(url: string, filename?: string, config?: any): Promise<void> {
    // 模拟下载
    console.log(`模拟下载文件: ${filename || url}`)
  }
}

// 创建 HTTP 实例
const httpInstance = new Http()

// 导出默认实例
export default httpInstance
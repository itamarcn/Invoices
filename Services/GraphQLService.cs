using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System.Text;
using System.Text.Json;

namespace InvoicesManagement.Services
{
    public class GraphQLService
    {
        private readonly string _endpoint;
        private readonly string _adminSecret;

        public GraphQLService(IOptions<AppSettings> appSettings)
        {
            _endpoint = appSettings.Value.HasuraEndpoint;
            _adminSecret = appSettings.Value.HasuraAdminSecret;
        }

        public async Task<HttpResponseMessage> SendGraphQlRequest(string query, object variables = null)
        {
            using var httpClient = new HttpClient();

            if (!string.IsNullOrEmpty(_adminSecret))
            {
                httpClient.DefaultRequestHeaders.Add("x-hasura-admin-secret", _adminSecret);
                httpClient.DefaultRequestHeaders.Add("Authorization", $"Bearer {_adminSecret}");
            }

            var requestPayload = new { query, variables };
            var jsonPayload = JsonConvert.SerializeObject(requestPayload);
            var content = new StringContent(jsonPayload, Encoding.UTF8, "application/json");

            return await httpClient.PostAsync(_endpoint, content);
        }

        public T ParseGraphQlResponse<T>(HttpResponseMessage response, string propertyName)
        {
            var responseContent = response.Content.ReadAsStringAsync().Result;

            if (response.IsSuccessStatusCode)
            {
                var jsonDocument = JsonDocument.Parse(responseContent);
                var resultArray = jsonDocument.RootElement.GetProperty("data").GetProperty(propertyName).ToString();
                return JsonConvert.DeserializeObject<T>(resultArray);
            }

            throw new Exception(responseContent);
        }
    }
}

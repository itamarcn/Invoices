using InvoicesManagement.Models;

namespace InvoicesManagement.Services
{
    public class UserService
    {
        private readonly GraphQLService _graphQLService;

        public UserService(GraphQLService graphQLService)
        {
            _graphQLService = graphQLService;
        }
        public async Task<List<User>> GetUsers()
        {
            var query = @"
                query GetUsers {
                    Users {
                        id
                        name
                        email
                        phone
                        address
                    }
                }
            ";

            var response = await _graphQLService.SendGraphQlRequest(query);
            return _graphQLService.ParseGraphQlResponse<List<User>>(response, "Users");
        }
    }
}

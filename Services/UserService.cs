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

        public async Task<User> GetUserById(string userId)
        {
            var query = @"
                query GetUserById($id: uuid!) {
                  Users_by_pk(id: $id) {
                    address
                    email
                    id
                    name
                    phone

                  }
                }
              ";

            var variables = new { id = userId };
            var response = await _graphQLService.SendGraphQlRequest(query, variables);
            return _graphQLService.ParseGraphQlResponse<User>(response, "Users_by_pk");
        }
    }
}

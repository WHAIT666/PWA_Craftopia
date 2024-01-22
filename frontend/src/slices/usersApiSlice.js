// As "slices" no Redux são uma parte do Redux Toolkit que simplificam a definição de reducers, actions e selectors em uma única unidade chamada "slice". 
import { apiSlice } from './apiSlice';
// Importa a constante 'USERS_URL' de um arquivo de constantes.
import { USERS_URL } from '../constants';

// Cria um conjunto de endpoints para as operações relacionadas a utilizadores usando 'apiSlice'.
export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // Operação de login do utilizador.
    login: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/auth`,
        method: 'POST',
        body: data,
      }),
    }),

    // Operação de registo de um novo utilizador.
    register: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}`,
        method: 'POST',
        body: data,
      }),
    }),

    // Operação de logout do utilizador.
    logout: builder.mutation({
      query: () => ({
        url: `${USERS_URL}/logout`,
        method: 'POST',
      }),
    }),

    // Operação de atualização de perfil do utilizador.
    profile: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/profile`,
        method: 'PUT',
        body: data,
      }),
    }),

    // Operação de obtenção de todos os utilizadores.
    getUsers: builder.query({
      query: () => ({
        url: USERS_URL,
      }),
      providesTags: ['User'],
      keepUnusedDataFor: 5,
    }),

    // Operação de exclusão de um utilizador específico.
    deleteUser: builder.mutation({
      query: (userId) => ({
        url: `${USERS_URL}/${userId}`,
        method: 'DELETE',
      }),
    }),

    // Operação de obtenção de detalhes de um utilizador específico.
    getUserDetails: builder.query({
      query: (id) => ({
        url: `${USERS_URL}/${id}`,
      }),
      keepUnusedDataFor: 5,
    }),

    // atualização de informações de um utilizador específico.
    updateUser: builder.mutation({
      query: (data) => ({
        url: `${USERS_URL}/${data.userId}`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['User'],
    }),
  }),
});

// Exporta os hooks gerados automaticamente pelo 'apiSlice' para cada operação.
export const {
  useLoginMutation,
  useLogoutMutation,
  useRegisterMutation,
  useProfileMutation,
  useGetUsersQuery,
  useDeleteUserMutation,
  useUpdateUserMutation,
  useGetUserDetailsQuery,
} = userApiSlice;
import { useMutation, useQuery, type UseMutationOptions, type UseQueryOptions } from "@tanstack/react-query";
import type { fileUploadPayload, getAllProductPayload, imageParamUploadPayload, productGetByIdPayload, productPayload, statusProductPayload } from "./types";
import ProductService from "./services";

// export const getCategoryList = {
//   useQuery: (opt?: UseQueryOptions<getAllProductPayload[]>) =>
//     useQuery({
//       queryKey: ['getCategoryList'],
//       queryFn: ProductService.getAllProduct,
//       ...opt,
//     })
// };

export const getProductList = {
  useQuery: (
    params: getAllProductPayload,
    opt?: UseQueryOptions<productPayload[]>
  ) =>
    useQuery({
      queryKey: ["getProductList", params],
      queryFn: () => ProductService.getAllProduct(params),
      ...opt,
    }),
};

export const getStatusProductList = {
  useQuery: (
    params: statusProductPayload,
    opt?: UseQueryOptions<productPayload[]>
  ) =>
    useQuery({
      queryKey: ["getStatusProductList", params],
      queryFn: () => ProductService.getStatusProduct(params),
      ...opt,
    }),
};

export const getByProduct = {
  useQuery: ( params: productGetByIdPayload, opt?: UseQueryOptions<productPayload>) =>
    useQuery<productPayload>({
      queryKey: ["getByProduct", params.id],
      queryFn: () => ProductService.getByIdProduct(params),
      ...opt,
    })
}

export const addProfileImage = {
  useMutation: (
    opt?: UseMutationOptions<fileUploadPayload, Error, imageParamUploadPayload>
  ) =>
    useMutation<fileUploadPayload, Error, imageParamUploadPayload>({
      mutationKey: ["addProfileImage"],
      mutationFn: (params) => ProductService.addFileUpload(params),
      ...opt,
    }),
};
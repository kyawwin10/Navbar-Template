import { useQuery, type UseQueryOptions } from "@tanstack/react-query";
import type { getAllProductPayload, productGetByIdPayload, productPayload } from "./types";
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

export const getByProduct = {
  useQuery: ( params: productGetByIdPayload, opt?: UseQueryOptions<productPayload>) =>
    useQuery<productPayload>({
      queryKey: ["getByProduct", params.id],
      queryFn: () => ProductService.getByIdProduct(params),
      ...opt,
    })
}
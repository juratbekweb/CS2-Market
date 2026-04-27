import { useEffect, useState, useCallback } from 'react'
import { getProducts } from '../services/api'
import { products as localProducts } from '../data/products'

const localProductsById = new Map(localProducts.map((product) => [product.id, product]))

function hydrateProduct(product) {
  const localProduct = localProductsById.get(product.id)
  if (!localProduct) {
    return product
  }

  return {
    ...localProduct,
    ...product,
    image: product.image || localProduct.image,
    stats: product.stats || localProduct.stats,
    description: product.description || localProduct.description,
  }
}

export function useProducts() {
  const [products, setProducts] = useState(localProducts)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const refresh = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const fetched = await getProducts()
      const hydratedProducts = fetched.map(hydrateProduct)
      const localOnlyProducts = localProducts.map((localProduct) => {
        const remoteProduct = hydratedProducts.find((product) => product.id === localProduct.id)
        return remoteProduct || localProduct
      })
      const remoteOnlyProducts = hydratedProducts.filter(
        (product) => !localProductsById.has(product.id),
      )
      const mergedProducts = [...localOnlyProducts, ...remoteOnlyProducts]
      setProducts(mergedProducts)
    } catch (err) {
      setError(err)
      setProducts(localProducts)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { products, loading, error, refresh }
}

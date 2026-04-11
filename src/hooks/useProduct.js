import { useEffect, useState } from 'react'
import { getProduct } from '../services/api'
import { products as localProducts } from '../data/products'

const localProductsById = new Map(localProducts.map((product) => [product.id, product]))

function hydrateProduct(product) {
  if (!product) {
    return product
  }

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

export function useProduct(id) {
  const [product, setProduct] = useState(() => localProducts.find(p => p.id === id))
  const [loading, setLoading] = useState(() => !localProducts.find(p => p.id === id))
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    const load = async () => {
      if (!localProducts.find((productItem) => productItem.id === id)) {
        setLoading(true)
      }
      setError(null)
      try {
        const fetched = await getProduct(id)
        if (!cancelled) setProduct(hydrateProduct(fetched))
      } catch (err) {
        if (!cancelled) {
          setError(err)
          setProduct(localProducts.find(p => p.id === id) || null)
        }
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    if (id != null) {
      load()
    } else {
      setLoading(false)
    }

    return () => { cancelled = true }
  }, [id])

  return { product, loading, error }
}

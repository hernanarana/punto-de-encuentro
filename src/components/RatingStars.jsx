import { FaStar, FaRegStar, FaStarHalfAlt } from 'react-icons/fa'

export default function RatingStars({ value = 0, size = 16 }) {
  const stars = []
  for (let i = 1; i <= 5; i++) {
    const diff = value - i
    if (diff >= 0) stars.push(<FaStar key={i} size={size} />)
    else if (diff > -1) stars.push(<FaStarHalfAlt key={i} size={size} />)
    else stars.push(<FaRegStar key={i} size={size} />)
  }
  return <div className="stars">{stars}</div>
}

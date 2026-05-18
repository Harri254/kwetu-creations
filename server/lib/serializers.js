export function formatUser(user) {
  return {
    id: user._id.toString(),
    firstName: user.firstName,
    lastName: user.lastName,
    displayName: user.displayName,
    email: user.email,
    photoURL: user.photoURL,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export function formatReview(review) {
  return {
    id: review._id.toString(),
    userId: review.user ? review.user.toString() : null,
    userName: review.userName,
    rating: review.rating,
    comment: review.comment,
    createdAt: review.createdAt,
  };
}

export function formatProduct(product) {
  return {
    id: product._id.toString(),
    title: product.title,
    slug: product.slug,
    description: product.description,
    imageUrl: product.imageUrl,
    category: product.category,
    liveUrl: product.liveUrl,
    averageRating: product.averageRating,
    reviewCount: product.reviewCount,
    createdAt: product.createdAt,
    updatedAt: product.updatedAt,
    reviews: (product.reviews || []).map(formatReview),
  };
}

export function formatSpecialist(specialist) {
  return {
    id: specialist._id.toString(),
    name: specialist.name,
    title: specialist.title,
    status: specialist.status,
    availability: specialist.availability,
    createdAt: specialist.createdAt,
    updatedAt: specialist.updatedAt,
  };
}

export function formatService(service) {
  return {
    id: service._id.toString(),
    serviceType: service.serviceType,
    slug: service.slug,
    title: service.title,
    description: service.description,
    icon: service.icon,
    basePrice: service.basePrice,
    isActive: service.isActive,
    requirementFields: service.requirementFields,
    createdAt: service.createdAt,
    updatedAt: service.updatedAt,
  };
}

export function formatMessage(message) {
  return {
    id: message._id.toString(),
    senderId: message.sender ? message.sender.toString() : 'system',
    senderName: message.senderName,
    senderRole: message.senderRole,
    content: message.content,
    status: message.status,
    readAt: message.readAt,
    timestamp: message.createdAt,
  };
}

export function formatOrder(order) {
  return {
    id: order._id.toString(),
    userId: order.client?._id ? order.client._id.toString() : order.client.toString(),
    clientName: order.clientName,
    designType: order.designType,
    specialistId: order.specialist?._id
      ? order.specialist._id.toString()
      : order.specialist.toString(),
    status: order.status,
    paymentStatus: order.paymentStatus,
    amount: order.amount,
    requirements: Object.fromEntries(order.requirements || []),
    createdAt: order.createdAt,
    updatedAt: order.updatedAt,
    messages: (order.messages || []).map(formatMessage),
  };
}

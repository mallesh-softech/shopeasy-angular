import { Injectable, signal } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { CustomerReview } from '../../models/product.model';

const MOCK_REVIEWS: CustomerReview[] = [
  { id: 'r1', productId: '1', customerName: 'Rahul Sharma', avatar: 'https://ui-avatars.com/api/?name=Rahul+Sharma&background=0d9488&color=fff', rating: 5, title: 'Absolutely love this product!', comment: 'This is hands down the best purchase I have made this year. The quality is outstanding and it exceeded all my expectations. Delivery was super fast too!', date: '2024-12-10', verified: true, helpful: 24 },
  { id: 'r2', productId: '1', customerName: 'Priya Patel', avatar: 'https://ui-avatars.com/api/?name=Priya+Patel&background=7c3aed&color=fff', rating: 4, title: 'Great value for money', comment: 'Really happy with this purchase. The build quality is solid and it looks exactly like the pictures. Only minor issue is the packaging could be better, but the product itself is great.', date: '2024-12-05', verified: true, helpful: 18 },
  { id: 'r3', productId: '1', customerName: 'Amit Kumar', avatar: 'https://ui-avatars.com/api/?name=Amit+Kumar&background=2563eb&color=fff', rating: 5, title: 'Exceeded my expectations', comment: 'I was a bit skeptical at first but this product is genuinely amazing. The quality is top notch and it works perfectly. Would definitely recommend to anyone looking for this type of product.', date: '2024-11-28', verified: false, helpful: 12 },
  { id: 'r4', productId: '1', customerName: 'Sneha Reddy', avatar: 'https://ui-avatars.com/api/?name=Sneha+Reddy&background=d97706&color=fff', rating: 3, title: 'Decent but has some issues', comment: 'The product is okay for the price. It does what it is supposed to do but I expected a bit more premium feel. The color is slightly different from the photos. Overall it is acceptable.', date: '2024-11-20', verified: true, helpful: 7 },
  { id: 'r5', productId: '1', customerName: 'Vikram Singh', avatar: 'https://ui-avatars.com/api/?name=Vikram+Singh&background=dc2626&color=fff', rating: 4, title: 'Good product, fast delivery', comment: 'Ordered this for my wife and she loves it. The quality is good and the delivery was within 2 days. Will definitely order again from this seller.', date: '2024-11-15', verified: true, helpful: 15 },
  { id: 'r6', productId: '1', customerName: 'Meera Nair', avatar: 'https://ui-avatars.com/api/?name=Meera+Nair&background=059669&color=fff', rating: 5, title: 'Perfect! Exactly as described', comment: 'Everything about this product is perfect. The quality, the finish, the packaging — all top class. I have already recommended it to my friends and family. 5 stars without any doubt!', date: '2024-11-08', verified: true, helpful: 31 },
  { id: 'r7', productId: '2', customerName: 'Arjun Mehta', avatar: 'https://ui-avatars.com/api/?name=Arjun+Mehta&background=0d9488&color=fff', rating: 5, title: 'Best in class!', comment: 'Superb product. I have tried many similar products but this one stands out. The performance is excellent and it is very durable.', date: '2024-12-08', verified: true, helpful: 20 },
  { id: 'r8', productId: '2', customerName: 'Divya Krishnan', avatar: 'https://ui-avatars.com/api/?name=Divya+Krishnan&background=7c3aed&color=fff', rating: 4, title: 'Very satisfied with purchase', comment: 'Good quality product. Matches the description well. Delivery was on time. Would buy again.', date: '2024-11-25', verified: true, helpful: 9 },
  { id: 'r9', productId: '3', customerName: 'Ravi Teja', avatar: 'https://ui-avatars.com/api/?name=Ravi+Teja&background=2563eb&color=fff', rating: 5, title: 'Outstanding quality!', comment: 'I am really impressed with the quality of this product. It is well made and very functional. Highly recommend!', date: '2024-12-01', verified: true, helpful: 16 },
];

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private reviews = signal<CustomerReview[]>(MOCK_REVIEWS);

  getReviews(productId: string): Observable<CustomerReview[]> {
    return of(this.reviews().filter(r => r.productId === productId)).pipe(delay(400));
  }

  addReview(review: Omit<CustomerReview, 'id' | 'helpful'>): Observable<CustomerReview> {
    const newReview: CustomerReview = { ...review, id: 'r' + Date.now(), helpful: 0 };
    this.reviews.update(rs => [newReview, ...rs]);
    return of(newReview).pipe(delay(600));
  }

  markHelpful(reviewId: string): void {
    this.reviews.update(rs => rs.map(r => r.id === reviewId ? { ...r, helpful: r.helpful + 1 } : r));
  }
}

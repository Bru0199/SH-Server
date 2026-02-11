export async function calculateOrderTotals(items, couponId) {
  const Menu = (await import('../models/Menu.js')).default;
  const Coupon = (await import('../models/Coupon.js')).default;
  const Addon = (await import('../models/Addon.js')).default;
  let subTotal = 0;
  let discountAmount = 0;
  let couponCode = null;

  for (const item of items) {
    const menuItem = await Menu.findById(item.menu);
    if (!menuItem) throw new Error('Menu item not found');
    subTotal += menuItem.price * item.quantity;
    if (item.addons && item.addons.length) {
      for (const addonId of item.addons) {
        const addon = await Addon.findById(addonId);
        if (addon) subTotal += addon.price;
      }
    }
  }

  if (couponId) {
    const couponDoc = await Coupon.findById(couponId);
    if (couponDoc && couponDoc.expiresAt > Date.now()) {
      discountAmount = couponDoc.discount;
      couponCode = couponDoc.code;
    }
  }

  const total = Math.max(subTotal - discountAmount, 0);
  return { subTotal, discountAmount, total, couponCode };
}

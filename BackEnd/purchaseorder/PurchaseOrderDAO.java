package com.info5059.casestudy.purchaseorder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import javax.persistence.EntityManager;
import javax.persistence.EntityNotFoundException;
import javax.persistence.PersistenceContext;

import com.info5059.casestudy.product.Product;
import com.info5059.casestudy.product.ProductRepository;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class PurchaseOrderDAO {
    @PersistenceContext
    private EntityManager entityManager;
    @Autowired
    private ProductRepository prodRepo;

    @Transactional
    public long create(PurchaseOrder clientpo) {
        PurchaseOrder realOrder = new PurchaseOrder();
        realOrder.setPodate(LocalDateTime.now());
        realOrder.setVendorid(clientpo.getVendorid());
        realOrder.setAmount(clientpo.getAmount());
        entityManager.persist(realOrder);

        for (PurchaseOrderLineItem item : clientpo.getItems()) {
            PurchaseOrderLineItem realItem = new PurchaseOrderLineItem();
            realItem.setPoid(realOrder.getId());
            realItem.setProductid(item.getProductid());
            realItem.setPrice(item.getPrice());
            realItem.setQty(item.getQty());
            entityManager.persist(realItem);
            // update the QOO on product table
            Product prod = prodRepo.findById(item.getProductid()).get();
            prod.setQoo(prod.getQoo() + item.getQty());
            prodRepo.save(prod);
        }
        return realOrder.getId();
    }

    public PurchaseOrder findOne(Long id) {
        PurchaseOrder po = entityManager.find(PurchaseOrder.class, id);
        if (po == null) {
            throw new EntityNotFoundException("Can't find purchase order for ID " + id);
        }
        return po;
    }

    @SuppressWarnings("unchecked")
    public List<PurchaseOrder> findByVendor(long vendorid) {
        return entityManager.createQuery("select p from PurchaseOrder p where p.vendorid = :id")
                .setParameter("id", vendorid).getResultList();
    }
}

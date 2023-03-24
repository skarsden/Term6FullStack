package com.info5059.casestudy.purchaseorder;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@CrossOrigin
@RestController
public class PurchaseOrderController {
    @Autowired
    private PurchaseOrderDAO poDAO;
    @Autowired
    private PurchaseOrderRepository poRepository;

    @PostMapping("api/pos")
    public ResponseEntity<Long> addOne(@RequestBody PurchaseOrder clientpo) {
        Long poid = poDAO.create(clientpo);
        return new ResponseEntity<Long>(poid, HttpStatus.OK);
    }

    @GetMapping("api/pos")
    public ResponseEntity<Iterable<PurchaseOrder>> findAll() {
        Iterable<PurchaseOrder> pos = poRepository.findAll();
        return new ResponseEntity<Iterable<PurchaseOrder>>(pos, HttpStatus.OK);
    }

    @GetMapping("api/pos/{id}")
    public ResponseEntity<Iterable<PurchaseOrder>> findByVendorId(@PathVariable long id) {
        Iterable<PurchaseOrder> pos = poDAO.findByVendor(id);
        return new ResponseEntity<Iterable<PurchaseOrder>>(pos, HttpStatus.OK);
    }
}

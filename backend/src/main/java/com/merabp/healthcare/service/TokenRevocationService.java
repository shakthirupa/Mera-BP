package com.merabp.healthcare.service;

import com.merabp.healthcare.repository.RefreshTokenRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TokenRevocationService {

    private final RefreshTokenRepository repo;

    public TokenRevocationService(RefreshTokenRepository repo) {
        this.repo = repo;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public void revokeFamily(String familyId) {
        repo.revokeAllByFamilyId(familyId);

        // 🔥 FORCE FLUSH (IMPORTANT)
        repo.flush();
    }
}
package com.ravilogistics.pick.repository;

import com.ravilogistics.pick.entity.PickConfirmation;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PickConfirmationRepository extends JpaRepository<PickConfirmation, Long> {

    List<PickConfirmation> findByPickTaskId(Long pickTaskId);
}

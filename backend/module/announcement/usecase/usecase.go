package usecase

import (
	"context"
	"errors"

	"siakup-fs-test-starter/module/announcement/domain"
)

type UseCase struct {
	repository domain.AnnouncementRepository
}

func NewUseCase(repository domain.AnnouncementRepository) *UseCase {
	return &UseCase{repository: repository}
}

// TODO(candidate): implement per the contract documented on
// domain.AnnouncementUseCase.GetList. Compute totalPages from total and
// filter.Size — see the pagination logic question in the written test if
// you're unsure how to handle filter.Size <= 0.

func (u *UseCase) GetList(ctx context.Context, filter domain.AnnouncementFilter) ([]*domain.Announcement, int64, int, error) {
	announcements, total, err := u.repository.FindAll(ctx, filter)
	if err != nil {
		return nil, 0, 0, err
	}

	totalPages := 0
	if filter.Size > 0 {
		totalPages = int((total + int64(filter.Size) - 1) / int64(filter.Size))
	}

	return announcements, total, totalPages, nil
}

// TODO(candidate): implement per the contract documented on
// domain.AnnouncementUseCase.Create. Validation belongs here, NOT in the HTTP
// handler and NOT in the repository.
func (u *UseCase) Create(ctx context.Context, req domain.CreateAnnouncementRequest) (*domain.Announcement, error) {
	if req.Title == "" {
		return nil, errors.New("title cannot be empty")
	}
	if req.Content == "" {
		return nil, errors.New("content cannot be empty")
	}

	announcement := &domain.Announcement{
		Title:   req.Title,
		Content: req.Content,
	}

	err := u.repository.Store(ctx, announcement)
	if err != nil {
		return nil, err
	}

	return announcement, nil		
}

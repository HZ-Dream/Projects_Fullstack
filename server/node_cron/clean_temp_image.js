cloudinary.api
    .resources_by_tag('temp_upload_quiz', {
        max_results: 100,
    })
    .then((result) => {
        const expiredImages = result.resources
            .filter((img) => {
                const created = new Date(img.created_at);
                return new Date() - created > 24 * 60 * 60 * 1000;
            })
            .map((img) => img.public_id);

        if (expiredImages.length > 0) {
            cloudinary.api.delete_resources(expiredImages);
        }
    });

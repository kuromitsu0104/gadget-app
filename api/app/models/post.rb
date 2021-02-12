class Post < ApplicationRecord
  include Rails.application.routes.url_helpers

  ################################################################################################
  # アソシエーション
  ################################################################################################
  has_many_attached :images
  belongs_to :user
  has_many :post_tag_maps, dependent: :destroy
  has_many :tags, through: :post_tag_maps
  has_many :likes, dependent: :destroy
  has_many :liked_users, through: :likes, source: :user
  has_many :post_comments, dependent: :destroy
  has_many :notices, dependent: :destroy

  ################################################################################################
  # バリデーション
  ################################################################################################
  validates :description, presence: true, length: { maximum: 255 }

  ################################################################################################
  # 画像データのURL取得
  ################################################################################################
  def images_url
    if images.attached?
      i = 0
      count = images.length
      imageList = []
      while i < count
        imageList.push(url_for(images[i]))
        i += 1
      end
      return imageList
    else
      return nil
    end
  end

  ################################################################################################
  # タグ更新
  ################################################################################################
  def save_tag(sent_tags)
    current_tags = []
    current_tags = self.tags.pluck(:tag_name) unless self.tags.nil?
    old_tags = current_tags - sent_tags
    new_tags = sent_tags - current_tags
    old_tags.each do |old|
      self.tags.delete Tag.find_by(tag_name: old)
    end
    new_tags.each do |new|
      new_post_tag = Tag.find_or_create_by(tag_name: new)
      self.tags << new_post_tag
    end
  end

  ################################################################################################
  # 検索
  ################################################################################################
  def self.search(post_name)
    Post.where(['description LIKE ?', "%#{post_name}%"])
  end

end

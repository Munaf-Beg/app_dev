import React from  "react"
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FestEvents } from '../data/events';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Surface ,Text} from "react-native-paper";

interface Event{
  event: FestEvents;
  isSelected: boolean; 
  onToggle: () => void;
  isFeatured:boolean;
}

const EventImage = (event: FestEvents) => {
    const category = event.category;
    const name = event.name.toLowerCase();
    if (category === 'Music') return require('../../assets/images/music.jpg');
    if (category === 'Tech') return require('../../assets/images/tech.jpg');
    if (category === 'Dance') return require('../../assets/images/dance.jpg');
    if (category === 'Analytics') return require('../../assets/images/analytics.jpg');
    if (category === 'Misc') {
        if (name.includes('debate')) return require('../../assets/images/debate.jpg');
        if (name.includes('gambling mathematics')) return require('../../assets/images/gambling.jpg');
        if (name.includes('standup')) return require('../../assets/images/standup.jpg');
        if (name.includes('treasure')) return require('../../assets/images/treasure.jpg');
        if (name.includes('paper')) return require('../../assets/images/academic.jpg');
    }
};

export const EventCard = ({ event, isSelected, onToggle,isFeatured }: Event) => {
    const CardImage=EventImage(event);
    return(
      <Surface style={styles.cardContainer}>
        {/*image*/}
        <View style={styles.imageContainer}>
            <Image 
                source={CardImage}
                style={styles.imageCard}
                resizeMode='cover'
            />
            {isFeatured && (
            <View style={styles.featuredBadge}>
                <Text style={styles.featuredText}>FEATURED</Text>
            </View>
            )}
        </View>
        <View style={styles.cardContent}>
            <View style={styles.contentText}>
                <Text variant="labelSmall" style={styles.eventCategory}>
                    {event.category}
                </Text>
                <Text variant="labelSmall" style={styles.eventName}>
                    {event.name}
                </Text>
                <View style={styles.eventRow}>
                    <MaterialCommunityIcons name="map-marker-outline" size={16} color="#48E5C2" />
                    <Text variant="labelSmall" style={styles.eventText}>
                        {event.venue}
                    </Text>
                </View>
                <View style={styles.eventRow}>
                    <MaterialCommunityIcons name="clock-outline" size={16} color="#48E5C2" />
                    <Text variant="labelSmall" style={styles.eventText}>
                        {event.time}
                    </Text>
                </View>
                <View style={styles.eventRow}>
                    <MaterialCommunityIcons name="account-group-outline" size={16} color="#48E5C2" />
                    <Text variant="labelSmall" style={styles.eventText}>
                        {event.registrations}
                    </Text>
                </View>
            </View>
            {/* 2. Save Button */}
            <TouchableOpacity 
                style={[styles.saveBtn, isSelected && styles.savedBtn]} 
                onPress={onToggle}
                activeOpacity={0.8}>
                <MaterialCommunityIcons 
                    name={isSelected ? "bookmark" : "bookmark-outline"} 
                    size={18} 
                    color={isSelected ? "#000" : "#fff"} 
                />
                <Text style={[styles.saveBtnText, isSelected && styles.savedBtnText]}>
                {isSelected ? "Saved" : "Save Event"}
                </Text>
            </TouchableOpacity>
        </View>
    </Surface>
    );
};

const styles = StyleSheet.create({
    cardContainer:{
        overflow: 'hidden',
        backgroundColor: '#1A1C1E',
        flexDirection: 'column', 
        justifyContent: 'space-between',  
        width: '92%', 
        alignSelf: 'center',
        padding: 16,
        borderRadius: 20,
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.3,
        shadowRadius: 12,
        elevation: 8,
    },
    imageContainer:{
        height: 160,
        width: '100%',
    },
    imageCard:{
        width: '100%', 
        height: '100%',
    },
    featuredBadge:{
        position: 'absolute', 
        top: 12, 
        right: 12,
        backgroundColor: '#D187FF', 
        paddingVertical: 4, 
        paddingHorizontal: 12, 
        borderRadius: 12,
    },
    featuredText:{
        fontSize: 10, 
        fontWeight: '900', 
        color: '#000', 
        letterSpacing: 1,
    },
    cardContent:{
        padding: 20,
        width:'100%',
    },
    contentText:{
        color: '#48E5C2', 
        fontWeight: '800', 
        fontSize: 12, 
        marginBottom: 4, 
        letterSpacing: 1,
    },
    eventCategory:{
        color: '#48E5C2', 
        fontWeight: '800', 
        fontSize: 12, 
        marginBottom: 4, 
        letterSpacing: 1,
    },
    eventName:{
        color: '#fff',
        lineHeight:32,
        paddingVertical: 8,
        fontSize: 24, 
        fontWeight: '700', 
        marginBottom: 12,
        width: '100%', 
        alignSelf: 'center',
    },
    eventRow:{
        flexDirection: 'row', 
        alignItems: 'center', 
        marginBottom: 8,
    },
    eventText:{
        color: '#9BA1A6', 
        fontSize: 14, 
        marginLeft: 8, 
        fontWeight: '500',
    },
    saveBtn:{
        backgroundColor: '#3f249f', 
        flexDirection: 'row', 
        justifyContent: 'center', 
        alignItems: 'center', 
        paddingVertical: 12, 
        width: '100%',       
        borderRadius: 15, 
        marginTop: 15,
    },
    saveBtnText:{
        color: '#fff', 
        fontWeight: '700',
        marginLeft: 8,
    },
    savedBtn:{
        backgroundColor: '#7fe1cc',
    },
    savedBtnText:{
        color:"#000",
    },
});
